module Page exposing (..)

import Api exposing (ApiResponse(..))
import Bet exposing (Bet)
import Bet.Confidence as Confidence exposing (Confidence)
import Bet.Date as Date exposing (Date)
import Browser.Navigation exposing (Key)
import DatePicker
import Delay
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Font as Font
import Element.Input as Input
import Element.Region as Region
import Http
import Page.Field as Field
import Page.InputCounter as InputCounter exposing (InputCounter, LastInput)
import Palette.Color as Color
import Palette.Distance as Distance
import Palette.FontSize as FontSize
import Problem exposing (Problem(..))
import Svg
import Svg.Attributes
import User exposing (User(..))
import User.Email
import User.Guest as Guest exposing (Guest)
import User.Member as Member exposing (Member)
import User.Member.Passcode as Passcode exposing (Passcode)
import User.Name
import Valid exposing (Valid, object)
import Valid.AutoCheck as AutoCheck exposing (AutoChecking)
import Valid.Certified as Certified exposing (Certificate(..), CertifiedEmail, CertifiedName)



-- Model


type Problem
    = TokenNotFound Passcode
    | Unspecified (List String)
    | HttpError Http.Error


type State
    = Interactive
    | WaitingForResponse


type SubScreen
    = Definition_NoMaskDay


type alias Model =
    { key : Key
    , state : State
    , subScreen : Maybe SubScreen
    , problem : Maybe Problem
    , user : User
    , confidence : AutoChecking Confidence
    , date : AutoChecking Date
    , inputCounter : InputCounter
    , datePicker : DatePicker.Model
    , plotBet : Maybe Bet
    }


init : Key -> Model
init key =
    { key = key
    , state = Interactive
    , subScreen = Nothing
    , problem = Nothing
    , user = NewUser Guest.init
    , confidence = AutoCheck.initFromString Confidence.toString Confidence.fromString ""
    , date = AutoCheck.initFromString Date.toString Date.fromString ""
    , inputCounter = InputCounter.init
    , datePicker = DatePicker.init
    , plotBet = Nothing
    }


initWithMember : Key -> Member -> Model
initWithMember key member =
    init key |> changeMember member


initWithProblem : Key -> Problem -> Model
initWithProblem key problem =
    init key |> setProblem problem



-- Setter & Getter


setState x m =
    { m | state = x }


setUser x m =
    { m | user = x }


setGuest x m =
    { m | user = NewUser x }


setMember x m =
    { m | user = KnownUser x }


setConfidence x m =
    { m | confidence = x }


setDate x m =
    { m | date = x }


setProblem : Problem -> Model -> Model
setProblem problem model =
    { model | problem = Just problem }


updateConfidence fun s =
    { s | confidence = fun s.confidence }


updateDate fun s =
    { s | date = fun s.date }


changeMember : Member -> Model -> Model
changeMember member model =
    case Member.getBet member of
        Just bet ->
            { model
                | user = KnownUser member
                , confidence = AutoCheck.initFromObject Confidence.toString Confidence.fromString bet.confidence
                , date = AutoCheck.initFromObject Date.toString Date.fromString bet.date
                , plotBet = Just bet
            }

        Nothing ->
            model |> setMember member


getPublicBet : Model -> Maybe Bet
getPublicBet model =
    case ( AutoCheck.publicObject model.confidence, AutoCheck.publicObject model.date ) of
        ( Just confidence, Just date ) ->
            Just { confidence = confidence, date = date }

        ( _, _ ) ->
            Nothing



-- Update for Model
{--
      UpdateUser User
    | LoginMember Member
    | InputEmail String
    | ProcessVerifiedEmail (Result Http.Error CertifiedEmail)
    | VerifyEmail String
    | InputConfidence String
    | VerifyConfidence Int
    | InputDate String
    | VerifyDate Int
--}


type Msg
    = NoOp
    | SubmitBetGuest { name : Valid String, email : Valid String, confidence : Valid Confidence, date : Valid Date }
    | SubmitBetMember { passcode : Passcode, confidence : Valid Confidence, date : Valid Date }
    | DeleteBetMember Passcode
    | ProcessSubmit (Result Http.Error (ApiResponse Member))
      --InputMessages
    | Input Field.Any String
    | Check Field.Any LastInput
    | ProcessCertified Field.Guest (Result Api.ExtendedError CertifiedName)
    | ShowSubScreen SubScreen


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case ( msg, model.state ) of
        ( NoOp, _ ) ->
            model |> noCmd

        ( SubmitBetGuest param, Interactive ) ->
            model
                |> setState WaitingForResponse
                |> addCmd (Api.submitBetGuest ProcessSubmit param)

        ( SubmitBetMember param, Interactive ) ->
            model
                |> setState WaitingForResponse
                |> addCmd (Api.submitBetMember ProcessSubmit param)

        ( DeleteBetMember passcode, Interactive ) ->
            --todo
            model |> noCmd

        ( Input field input, Interactive ) ->
            model
                |> updateFieldValue field input
                |> waitForLastInput field input (Check field)

        ( Check field lastInput, Interactive ) ->
            case isLastInput field lastInput model of
                True ->
                    case field of
                        Field.Guest guestField ->
                            case model.user of
                                NewUser guest ->
                                    model |> certify guestField guest

                                KnownUser _ ->
                                    model |> noCmd

                        Field.Bet betField ->
                            case betField of
                                Field.Confidence ->
                                    model
                                        |> setConfidence
                                            (AutoCheck.makePublic model.confidence)
                                        |> noCmd

                                Field.Date ->
                                    model
                                        |> setDate (AutoCheck.makePublic model.date)
                                        |> noCmd

                False ->
                    model |> noCmd

        ( ProcessCertified field response, Interactive ) ->
            case model.user of
                NewUser guest ->
                    case response of
                        Ok certified ->
                            case field of
                                Field.Name ->
                                    case Certified.getObject certified == Guest.getName guest of
                                        True ->
                                            model
                                                |> setGuest (Guest.setCertifiedName certified guest)
                                                |> noCmd

                                        False ->
                                            model |> noCmd

                                Field.Email ->
                                    case Certified.getObject certified == Guest.getEmail guest of
                                        True ->
                                            model
                                                |> setGuest (Guest.setCertifiedEmail certified guest)
                                                |> noCmd

                                        False ->
                                            model |> noCmd

                        Err { method, bodySent, error } ->
                            case field of
                                Field.Name ->
                                    case User.Name.compareEncoding bodySent (Guest.getName guest) of
                                        True ->
                                            model
                                                |> setGuest
                                                    (Guest.errorInNameCertificate
                                                        [ "There are connection issues" ]
                                                        guest
                                                    )
                                                |> setProblem (HttpError error)
                                                |> noCmd

                                        False ->
                                            model |> noCmd

                                Field.Email ->
                                    case User.Email.compareEncoding bodySent (Guest.getEmail guest) of
                                        True ->
                                            model
                                                |> setGuest
                                                    (Guest.errorInEmailCertificate
                                                        [ "There are connection issues" ]
                                                        guest
                                                    )
                                                |> setProblem (HttpError error)
                                                |> noCmd

                                        False ->
                                            model |> noCmd

                KnownUser _ ->
                    model |> noCmd

        -- Messages that are WaitingForResponseMessage (but we also accept it for interactive)
        ( ProcessSubmit result, _ ) ->
            case result of
                Ok response ->
                    case response of
                        Success member ->
                            model
                                |> changeMember member
                                |> setState Interactive
                                |> addCmd
                                    (Browser.Navigation.pushUrl model.key (Member.passcodeAsLink member))

                        Failure issues ->
                            model |> setProblem (Unspecified issues) |> setState Interactive |> noCmd

                        ApiError method errors ->
                            model |> setProblem (Unspecified errors) |> setState Interactive |> noCmd

                        ResponseError method errors ->
                            model |> setProblem (Unspecified errors) |> setState Interactive |> noCmd

                Err httpError ->
                    model
                        |> setProblem (Unspecified [ Api.errorToString httpError ])
                        |> setState Interactive
                        |> noCmd

        ( ShowSubScreen subScreen, _ ) ->
            { model | subScreen = Just subScreen } |> noCmd

        ( _, WaitingForResponse ) ->
            model |> noCmd


addCmd msg model =
    ( model, msg )


certify : Field.Guest -> Guest -> Model -> ( Model, Cmd Msg )
certify field guest model =
    case field of
        Field.Name ->
            model
                |> setGuest (Guest.waitForNameVerification guest)
                |> addCmd (Api.checkName (ProcessCertified field) (Guest.getName guest))

        Field.Email ->
            model
                |> setGuest (Guest.waitForEmailVerification guest)
                |> addCmd (Api.checkEmail (ProcessCertified field) (Guest.getEmail guest))


updateFieldValue : Field.Any -> String -> Model -> Model
updateFieldValue field input model =
    case ( field, model.user ) of
        ( Field.Guest guestField, NewUser guest ) ->
            case guestField of
                Field.Name ->
                    model |> setGuest (Guest.setName input guest)

                Field.Email ->
                    model |> setGuest (Guest.setEmail input guest)

        ( Field.Guest _, KnownUser _ ) ->
            model

        ( Field.Bet betField, _ ) ->
            case betField of
                Field.Confidence ->
                    model
                        |> updateConfidence (AutoCheck.updateString input)
                        |> updatePlotBet

                Field.Date ->
                    model
                        |> updateDate (AutoCheck.updateString input)
                        |> updatePlotBet


updatePlotBet : Model -> Model
updatePlotBet model =
    case ( AutoCheck.object model.confidence, AutoCheck.object model.date ) of
        ( Just confidence, Just date ) ->
            { model | plotBet = Just { confidence = confidence, date = date } }

        ( _, _ ) ->
            model


waitForLastInput : Field.Any -> String -> (LastInput -> Msg) -> Model -> ( Model, Cmd Msg )
waitForLastInput field input toMsg model =
    let
        ( inputCounter, lastInput ) =
            InputCounter.newInput field input model.inputCounter
    in
    case input of
        "" ->
            ( model, Cmd.none )

        _ ->
            ( { model | inputCounter = inputCounter }
            , Delay.after 700 (toMsg lastInput)
            )


isLastInput : Field.Any -> LastInput -> Model -> Bool
isLastInput field lastInput model =
    case ( field, model.user ) of
        ( Field.Guest guestField, NewUser guest ) ->
            case guestField of
                Field.Name ->
                    InputCounter.match
                        field
                        lastInput
                        ( Guest.getName guest, model.inputCounter )

                Field.Email ->
                    InputCounter.match
                        field
                        lastInput
                        ( Guest.getEmail guest, model.inputCounter )

        ( Field.Guest _, KnownUser _ ) ->
            False

        ( Field.Bet betField, _ ) ->
            case betField of
                Field.Confidence ->
                    InputCounter.match
                        field
                        lastInput
                        ( AutoCheck.string model.confidence, model.inputCounter )

                Field.Date ->
                    InputCounter.match
                        field
                        lastInput
                        ( AutoCheck.string model.date, model.inputCounter )


noCmd : a -> ( a, Cmd msg )
noCmd a =
    ( a, Cmd.none )



-- WaitingForLastInputs
-- View


definition_NoMaskDay : Element Msg
definition_NoMaskDay =
    Element.el
        [ width fill
        , height fill
        , Color.Background |> Color.translate |> Background.color
        ]
        (text "bla")


view : Model -> Element Msg
view model =
    let
        subpage =
            case model.subScreen of
                Just Definition_NoMaskDay ->
                    definition_NoMaskDay

                Nothing ->
                    Element.none
    in
    column
        [ inFront subpage
        , width fill
        , height fill
        , Color.Background |> Color.translate |> Background.color
        , Distance.XB |> Distance.translate |> spacing
        , Color.FontNormal |> Color.translate |> Font.color
        , FontSize.M |> FontSize.translate |> Font.size
        ]
        [ header
        , mainscreen model
        , errorMessage model.problem
        , forms model
        ]


header : Element Msg
header =
    Element.el
        [ width fill
        , Color.NeonPurple |> Color.translate |> Font.color
        , Distance.B |> Distance.translate |> padding
        , FontSize.B |> FontSize.translate |> Font.size
        ]
        (Element.el
            [ Element.centerX
            , Element.centerY
            ]
            (Element.text "The no-mask-day bet!")
        )


mainscreen : model -> Element Msg
mainscreen model =
    textColumn [ width fill ]
        [ paragraph [] [ text "Corona is slowely coming to an end, it seems." ]
        , paragraph []
            [ text "But when exactly can we celebrate the "
            , Input.button
                [ Color.NeonGreen |> Color.translate |> Border.color
                , Border.solid
                , Border.width 1
                ]
                { onPress = Just (ShowSubScreen Definition_NoMaskDay), label = text "No-Mask-Day" }
            , text "?"
            ]
        , paragraph [] [ text "You can bet ", text "here", text "!" ]
        , paragraph [] [ text "Just date + confidecne" ]
        , paragraph [] [ text "and earn some real money" ]
        ]


errorMessage : Maybe Problem -> Element msg
errorMessage maybeProblem =
    Element.paragraph
        []
        [ case maybeProblem of
            Just problem ->
                case problem of
                    TokenNotFound token ->
                        "The Token: " ++ Passcode.toString token |> text

                    Unspecified description ->
                        description |> String.join "," |> text

                    HttpError httpError ->
                        "Error: " ++ Api.errorToString httpError |> text

            Nothing ->
                Element.none
        ]


forms : Model -> Element Msg
forms model =
    column
        [ Color.Background |> Color.translate |> Background.color
        , fill |> width
        , alignTop
        , centerX
        , Distance.S |> Distance.translate |> spacing
        ]
        (userArea model
            ++ betArea model
            ++ buttonArea model
        )


userArea : Model -> List (Element Msg)
userArea model =
    case model.user of
        NewUser guest ->
            [ text "Hi guest :)"
            , guestForm Field.Name guest
            , guestForm Field.Email guest
            ]

        KnownUser member ->
            [ text <| String.join " " [ "Hallo", Member.getName member, "! Schön dich zu sehen :)" ] ]


guestForm : Field.Guest -> Guest -> Element Msg
guestForm field guest =
    let
        variables =
            case field of
                Field.Name ->
                    { certificate = Guest.getNameCertificate guest
                    , text = Guest.getName guest
                    , placeholder = "Your Name"
                    , label = "Name"
                    }

                Field.Email ->
                    { certificate = Guest.getEmailCertificate guest
                    , text = Guest.getEmail guest
                    , placeholder = "Your Email"
                    , label = "Email"
                    }

        notifier =
            case variables.certificate of
                Unknown ->
                    Element.none

                Checking ->
                    Element.text "..."

                Good ->
                    Element.text "Take it!"

                Bad issueList ->
                    (Element.text "Issues: " :: List.map Element.text issueList) |> Element.column []

                Error errorList ->
                    (Element.text "Errors: " :: List.map Element.text errorList) |> Element.column []
    in
    Input.text
        (Element.onRight notifier :: formStyle)
        { onChange = Input (Field.Guest field)
        , text = variables.text
        , placeholder = Just (Input.placeholder [] (text variables.placeholder))
        , label = Input.labelHidden variables.label
        }


formStyle : List (Attribute msg)
formStyle =
    [ 280 |> px |> width
    , Color.Neutral |> Color.translate |> Background.color
    , Color.Background |> Color.translate |> Border.color
    , Distance.XXS |> Distance.translate |> Border.width
    , centerY
    ]


betArea model =
    [ text "Place your bet here my lad!"
    , betForm Field.Date model
    , betForm Field.Confidence model
    ]


betForm : Field.Bet -> Model -> Element Msg
betForm field model =
    let
        variables =
            case field of
                Field.Confidence ->
                    { notifier =
                        case AutoCheck.publicState model.confidence of
                            AutoCheck.Unknown ->
                                Element.none

                            AutoCheck.Bad ->
                                text "thats not a confidence"

                            AutoCheck.Good ->
                                text "go for it"
                    , text = AutoCheck.string model.confidence
                    , placeholder = "How confident are you?"
                    , label = "Confidence"
                    }

                Field.Date ->
                    { notifier =
                        case AutoCheck.publicState model.date of
                            AutoCheck.Unknown ->
                                Element.none

                            AutoCheck.Bad ->
                                text "thats not a date"

                            AutoCheck.Good ->
                                text "go for it"
                    , text = AutoCheck.string model.date
                    , placeholder = "When is the No-Mask-Day?"
                    , label = "Date"
                    }
    in
    Input.text
        (Element.onRight variables.notifier :: formStyle)
        { onChange = Input (Field.Bet field)
        , text = variables.text
        , placeholder = Just (Input.placeholder [] (text variables.placeholder))
        , label = Input.labelHidden variables.label
        }


buttonArea : Model -> List (Element Msg)
buttonArea model =
    [ row [ spacing 10 ] [ submitButton model ] ]


buttonStyle : Bool -> List (Attribute msg)
buttonStyle active =
    let
        basic =
            [ 120 |> px |> width
            , Color.Background |> Color.translate |> Border.color
            , Distance.XXS |> Distance.translate |> Border.width
            , centerX
            ]
    in
    case active of
        True ->
            basic ++ [ Color.Highlight |> Color.translate |> Background.color ]

        False ->
            basic ++ [ Color.Neutral |> Color.translate |> Background.color ]


submitButton : Model -> Element Msg
submitButton model =
    case model.user of
        NewUser guest ->
            case validateGuestBet model of
                Just forSubmit ->
                    Input.button
                        (buttonStyle True)
                        { onPress =
                            Just (SubmitBetGuest forSubmit)
                        , label =
                            text "Submit my bet!"
                        }

                Nothing ->
                    Input.button
                        (buttonStyle False)
                        { onPress =
                            Nothing
                        , label =
                            text "Submit my bet!"
                        }

        KnownUser member ->
            case validateMemberBet model of
                Just forSubmit ->
                    Input.button
                        (buttonStyle True)
                        { onPress =
                            Just (SubmitBetMember forSubmit)
                        , label =
                            text "Update my bet!"
                        }

                Nothing ->
                    Input.button
                        (buttonStyle False)
                        { onPress =
                            Nothing
                        , label =
                            text "Update my bet!"
                        }



-- Validate
--SubmitBetGuest { name : Valid String, email : Valid String, confidence : Valid Confidence, date : Valid Date }


validateMemberBet : Model -> Maybe { passcode : Passcode, confidence : Valid Confidence, date : Valid Date }
validateMemberBet model =
    case ( model.state, model.user ) of
        ( Interactive, KnownUser member ) ->
            case Member.getBet member /= getPublicBet model of
                True ->
                    case ( validateConfidence model, validateDate model ) of
                        ( Just confidence, Just date ) ->
                            Just
                                { passcode = Member.getPasscode member
                                , confidence = confidence
                                , date = date
                                }

                        ( _, _ ) ->
                            Nothing

                False ->
                    Nothing

        ( _, _ ) ->
            Nothing


validateGuestBet : Model -> Maybe { name : Valid String, email : Valid String, confidence : Valid Confidence, date : Valid Date }
validateGuestBet model =
    case model.state of
        Interactive ->
            case model.user of
                NewUser guest ->
                    case ( validateName model, validateEmail model ) of
                        ( Just name, Just email ) ->
                            case ( validateConfidence model, validateDate model ) of
                                ( Just confidence, Just date ) ->
                                    Just { name = name, email = email, confidence = confidence, date = date }

                                ( _, _ ) ->
                                    Nothing

                        ( _, _ ) ->
                            Nothing

                KnownUser member ->
                    Nothing

        WaitingForResponse ->
            Nothing


validateName : Model -> Maybe (Valid String)
validateName model =
    case model.user of
        NewUser guest ->
            Valid.fromCertified (Guest.getCertifiedName guest)

        KnownUser _ ->
            Nothing


validateEmail : Model -> Maybe (Valid String)
validateEmail model =
    case model.user of
        NewUser guest ->
            Valid.fromCertified (Guest.getCertifiedEmail guest)

        KnownUser _ ->
            Nothing


validateConfidence : Model -> Maybe (Valid Confidence)
validateConfidence model =
    Valid.fromAutoChecking model.confidence


validateDate : Model -> Maybe (Valid Date)
validateDate model =
    Valid.fromAutoChecking model.date
