port module Logic.Logic exposing (..)

import AccuracyPlot.AccuracyPlot as AccuracyPlot
import Animator
import Api.Api as Api exposing (ApiResponse(..), GuestSubmitResponse(..))
import Browser
import Browser.Dom
import Browser.Events
import Browser.Navigation exposing (Key)
import Date as DateExt
import DatePicker.DatePicker as DatePicker
import Delay
import Dict exposing (Dict)
import Field.Confidence as Confidence exposing (Confidence)
import Field.Date as Date exposing (Date)
import Field.Field as Field
import Http
import Logic.InputCounter as InputCounter exposing (LastInput)
import Logic.Page as Page exposing (..)
import Logic.Router as Router
import Logic.Utils exposing (..)
import Parser exposing ((|.), (|=))
import Task
import Time exposing (Posix)
import Url exposing (Url)
import Url.Builder
import User.Guest as Guest exposing (Guest)
import User.Member as Member exposing (Member)
import User.MemberBet as Bet exposing (MemberBet)
import User.Passcode as Passcode exposing (Passcode)
import User.User as User exposing (User(..))
import Valid.AutoCheck as AutoCheck exposing (AutoChecking)
import Valid.Certified as Certified exposing (Certified)
import Valid.Valid as Valid exposing (Valid)


startOfBet =
    Date.fromCalendarDate 2022 1 1


endOfBet =
    Date.fromCalendarDate 2024 12 31


type alias Model =
    { key : Key
    , url : Url
    , page : Page
    , today : Maybe Date
    , problem : Maybe Problem
    , user : User
    , confidence : AutoChecking Confidence
    , date : AutoChecking Date
    , inputControl : InputControl
    , inputCounter : InputCounter.InputCounter
    , datePicker : DatePicker.Model
    , successMessage : Maybe SuccessMessage

    -- Test
    , testCounter : Int
    , testPassFromUrl : Maybe Passcode
    , testPassFromMember : Maybe Passcode
    , testUrlToString : String

    -- Home
    , showSubmitButtonHint : Bool

    -- HowToBet
    , showTest : Bool
    , littleQuiz : Maybe LittleQuiz
    , littleQuizTries : Maybe Int

    --AboutAccuracyFunction
    , mathRendered : Bool

    -- ContacInfo
    , hintNameBox : { verbose : Bool, enterOnError : Int }
    , hintEmailBox : { verbose : Bool, enterOnError : Int }

    --Plot
    , plot : AccuracyPlot.Model
    , plotDomId : String
    , plotRange : PlotRange

    --Remarks and Detailed Explanations
    , showRnDSection :
        Dict String Bool

    -- Loading
    , posix : Time.Posix
    }


type Problem
    = Unspecified (List String)
    | ErrorInLogin (List String)
    | IssuesInBet (List String)
    | HttpError Http.Error


type
    InputControl
    --todo
    = InputAllowed
    | InputNotAllowed


type PlotRange
    = Till2022
    | Till2023
    | Till2024


type SuccessMessage
    = SuccessForNewUser
    | SuccessForOldUser


type LittleQuiz
    = Correct
    | False1
    | False2
    | False3


setPage x m =
    { m | page = x }


setProblem x m =
    { m | problem = x }


setInputControl x m =
    { m | inputControl = x }


setMember x m =
    { m | user = OldUser x }


setGuest x m =
    { m | user = NewUser x }


setConfidence x m =
    { m | confidence = x }


setDate x m =
    { m | date = x }


setPlot x m =
    { m | plot = x }


setSuccessMessage x m =
    { m | successMessage = x }


setLoadingWheel x m =
    { m | loadingWheel = x }


mapToUser fun m =
    { m | user = fun m.user }


mapToConfidence fun m =
    { m | confidence = fun m.confidence }


mapToDate fun m =
    { m | date = fun m.date }


mapToDatePicker fun m =
    { m | datePicker = fun m.datePicker }


mapToPlot fun m =
    { m | plot = fun m.plot }


init : () -> Url -> Key -> ( Model, Cmd Msg )
init _ url key =
    let
        maybePasscode =
            Passcode.fromUrl url

        targetPage =
            Router.toPage url

        ( guest, removeInvite ) =
            eatInvite url key

        model =
            { today = Nothing
            , key = key
            , url = url
            , page = Loading
            , problem = Nothing
            , user = NewUser guest
            , confidence =
                AutoCheck.initFromString
                    Confidence.toString
                    Confidence.fromString
                    ""
            , date =
                AutoCheck.initFromString
                    Date.toString
                    Date.fromString
                    ""
            , inputControl = InputAllowed
            , inputCounter = InputCounter.init
            , successMessage = Nothing

            -- Test
            , testCounter = 0
            , testPassFromUrl = Nothing
            , testPassFromMember = Nothing
            , testUrlToString = ""

            --loading
            , posix = Time.millisToPosix 0

            --Home
            , showSubmitButtonHint = False

            -- HowToBet
            , showTest = True
            , littleQuiz = Nothing
            , littleQuizTries = Just 0

            --AboutAccuracyFunction
            , mathRendered = False

            --ContacInfo
            , hintNameBox = { verbose = False, enterOnError = 0 }
            , hintEmailBox = { verbose = False, enterOnError = 0 }

            --RnD
            , showRnDSection =
                Dict.empty

            --Bet
            , plot =
                AccuracyPlot.init |> AccuracyPlot.setStartAndEnd startOfBet endOfBet
            , plotDomId = "accuracyPlot"
            , plotRange = Till2022
            , datePicker = DatePicker.initWithToday startOfBet
            }

        loginCmd =
            case maybePasscode of
                Just passcode ->
                    [ Api.login (ProcessLogin targetPage) passcode ]

                Nothing ->
                    []

        initCmds =
            [ DateExt.today
                |> Task.perform SetToday
            , updatePlotSize "accuracyPlot"
            , removeInvite
            ]
    in
    case maybePasscode of
        Just passcode ->
            ( model |> setPage Page.Loading
            , Cmd.batch (Api.login (ProcessLogin targetPage) passcode :: loginCmd ++ initCmds)
            )

        Nothing ->
            let
                ( newModel, homeCmd ) =
                    makeSureItsHome model
            in
            ( newModel, Cmd.batch (initCmds ++ [ homeCmd ]) )


type Msg
    = NoOp
    | ProcessLogin Page (Result Http.Error (ApiResponse Member))
    | SetToday Date
    | ProcessUrlRequest Browser.UrlRequest
    | ProcessUrlChange Url
    | GoHome
    | Input Field.Any String
    | Check Field.Any InputCounter.LastInput
    | ProcessCertified Field.Guest (Result Api.ExtendedError (Certified String))
    | FinshEnteringContactInfo Field.Guest
    | EnterOnNameBox
    | EnterOnEmailBox
    | BlurOnBox Field.Any
    | SetSubmitButtonHints Bool
    | SubmitBetForGuest
    | SubmitBetForMember { passcode : Passcode, confidence : Valid Confidence, date : Valid Date }
    | ProcessSubmitGuest (Result Http.Error GuestSubmitResponse)
    | ProcessSubmit (Result Http.Error (ApiResponse Member))
    | AcceptSubmitError
    | AcceptSubmitSuccess
    | PlotYears PlotRange
      -- HowToBet
    | ToggleTest Bool
    | AnswerLittleQuiz LittleQuiz
      --Bet
    | SetConfidence Int
    | DatePickerEvent DatePicker.ChangeEvent
    | PlotMsg AccuracyPlot.Msg
    | RequestPlotSizeUpdate
    | UpdatePlotSize (Result Browser.Dom.Error Browser.Dom.Element)
      -- RnD
    | SetVisibilityRnDSection String Bool
      --Loading
    | SetPosix Posix
      --TestMessages
    | TestProduceError
    | TestRenderMath


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case ( msg, model.inputControl ) of
        ( ProcessLogin page response, _ ) ->
            case response of
                Ok result ->
                    case result of
                        Success member ->
                            model
                                |> setMember member
                                |> mapToConfidence (AutoCheck.updateObject member.bet.confidence)
                                |> mapToDate (AutoCheck.updateObject member.bet.date)
                                |> mapToDatePicker (DatePicker.setVisibleMonth member.bet.date)
                                |> makeSureItsHome

                        Failure description ->
                            model
                                |> setProblem (Just (ErrorInLogin description))
                                |> makeSureItsHome

                        ResponseError method error ->
                            model
                                |> setProblem (Just (ErrorInLogin (method :: error)))
                                |> makeSureItsHome

                        _ ->
                            model |> makeSureItsHome

                Err error ->
                    --todo: better error message
                    model
                        |> setProblem (Just (ErrorInLogin [ Api.errorToString error ]))
                        |> makeSureItsHome

        ( SetToday date, _ ) ->
            { model | today = Just date } |> noCmd

        ( ProcessUrlRequest urlRequest, InputAllowed ) ->
            case urlRequest of
                Browser.Internal url ->
                    model
                        |> addCmd
                            (Browser.Navigation.pushUrl
                                model.key
                                (Url.toString url)
                            )

                Browser.External url ->
                    model
                        |> addCmd
                            (Browser.Navigation.load url)

        ( ProcessUrlChange url, _ ) ->
            let
                ( newModel, pageCmd ) =
                    openPage (Router.toPage url) model
            in
            newModel
                |> addCmd
                    (Cmd.batch
                        [ urlWithPasscode model url
                        , pageCmd
                        ]
                    )

        ( GoHome, InputAllowed ) ->
            model
                |> addCmd
                    (goHome model)

        ( Input field input, InputAllowed ) ->
            model
                |> updateFieldValue field input
                |> removeHints field
                |> waitForLastInput field input (Check field)

        ( Check field lastInput, _ ) ->
            case isLastInput field lastInput model of
                True ->
                    case ( field, model.user ) of
                        ( Field.Guest guestField, NewUser guest ) ->
                            model
                                |> certify guestField guest

                        ( Field.Guest _, OldUser _ ) ->
                            model |> noCmd

                        ( Field.Invite, NewUser guest ) ->
                            tryToSubmitBetForGuest model

                        ( Field.Invite, _ ) ->
                            model |> noCmd

                        ( Field.Bet betField, _ ) ->
                            model |> publishBet betField

                False ->
                    model |> noCmd

        ( ProcessCertified field response, _ ) ->
            case model.user of
                NewUser guest ->
                    model
                        |> setGuest (Guest.processCertificateResponse field response guest)
                        |> noCmd

                OldUser _ ->
                    model |> noCmd

        ( FinshEnteringContactInfo field, InputAllowed ) ->
            let
                cmd =
                    case ( Field.Name, validateName model, validateEmail model ) of
                        ( Field.Name, Nothing, _ ) ->
                            Cmd.none

                        ( Field.Email, _, Nothing ) ->
                            Cmd.none

                        ( _, Just _, Just _ ) ->
                            Browser.Navigation.pushUrl
                                model.key
                                (Url.Builder.absolute [ ".." ] [])

                        ( _, _, _ ) ->
                            focusContactInputs model
            in
            model
                |> addCmd
                    cmd

        ( EnterOnNameBox, InputAllowed ) ->
            model |> activateHints (Field.Guest Field.Name)

        ( BlurOnBox field, _ ) ->
            model |> removeHints field |> noCmd

        ( EnterOnEmailBox, InputAllowed ) ->
            model |> activateHints (Field.Guest Field.Email)

        ( SetConfidence int, InputAllowed ) ->
            let
                confidence =
                    Maybe.withDefault
                        Confidence.default
                        (Confidence.fromInt int)
            in
            model
                |> setConfidence (AutoCheck.updateObject confidence model.confidence)
                |> noCmd

        ( DatePickerEvent event, _ ) ->
            case event of
                DatePicker.DateChanged date ->
                    case model.inputControl of
                        InputAllowed ->
                            model
                                |> mapToDate (AutoCheck.updateObject date)
                                |> noCmd

                        InputNotAllowed ->
                            model |> noCmd

                DatePicker.PickerChanged subMsg ->
                    model
                        |> mapToDatePicker
                            (DatePicker.update subMsg)
                        |> noCmd

        ( SetSubmitButtonHints bool, _ ) ->
            { model | showSubmitButtonHint = bool } |> noCmd

        ( SubmitBetForGuest, InputAllowed ) ->
            tryToSubmitBetForGuest model

        ( SubmitBetForMember validBet, InputAllowed ) ->
            { model
                | inputControl = InputNotAllowed
                , showSubmitButtonHint = False
            }
                |> addCmd (Api.submitBetMember ProcessSubmit validBet)

        ( ProcessSubmitGuest result, _ ) ->
            case result of
                Ok response ->
                    case response of
                        NormalResponse normalResponse ->
                            processGeneralSubmitResponse normalResponse model

                        InviteIssue issue ->
                            case model.user of
                                NewUser guest ->
                                    model
                                        |> setGuest (Guest.badInvite issue guest)
                                        |> setInputControl InputAllowed
                                        |> openPage Page.CheckInvitation

                                OldUser member ->
                                    model |> noCmd

                Err httpError ->
                    model
                        |> setProblem (Just (HttpError httpError))
                        |> setInputControl InputAllowed
                        |> addCmd (goHome model)

        ( ProcessSubmit result, _ ) ->
            case result of
                Ok response ->
                    processGeneralSubmitResponse response model

                Err httpError ->
                    model
                        |> setProblem (Just (HttpError httpError))
                        |> setInputControl InputAllowed
                        |> addCmd (goHome model)

        ( AcceptSubmitError, _ ) ->
            model
                |> setProblem Nothing
                |> noCmd

        ( AcceptSubmitSuccess, _ ) ->
            model
                |> setSuccessMessage Nothing
                |> noCmd

        ( PlotMsg subMsg, _ ) ->
            let
                ( newPlot, cmd ) =
                    AccuracyPlot.update subMsg model.plot
            in
            model
                |> setPlot newPlot
                |> addCmd (Cmd.map PlotMsg cmd)

        ( RequestPlotSizeUpdate, _ ) ->
            model |> addCmd (updatePlotSize model.plotDomId)

        ( UpdatePlotSize res, _ ) ->
            case res of
                Ok elm ->
                    model
                        |> mapToPlot
                            (AccuracyPlot.setSize
                                { width = elm.element.width
                                , height = elm.element.height
                                }
                            )
                        |> noCmd

                Err _ ->
                    model |> noCmd

        ( PlotYears plotRange, _ ) ->
            { model | plotRange = plotRange }
                |> noCmd

        -- HowToBet
        ( AnswerLittleQuiz answer, _ ) ->
            case ( model.littleQuiz, model.littleQuizTries ) of
                ( _, Nothing ) ->
                    { model
                        | littleQuiz = Just answer
                        , mathRendered = False
                    }
                        |> noCmd

                ( Just Correct, _ ) ->
                    { model
                        | littleQuiz = Just answer
                        , littleQuizTries = Nothing
                        , mathRendered = False
                    }
                        |> noCmd

                ( _, Just currentTries ) ->
                    case answer of
                        Correct ->
                            { model
                                | littleQuiz = Just answer
                                , mathRendered = False
                            }
                                |> noCmd

                        _ ->
                            { model
                                | littleQuiz = Just answer
                                , littleQuizTries = Just (currentTries + 1)
                                , mathRendered = False
                            }
                                |> noCmd

        ( ToggleTest bool, _ ) ->
            { model | showTest = bool } |> noCmd

        ( SetVisibilityRnDSection sectionId bool, _ ) ->
            model |> setVisibilityRnDSection sectionId bool |> noCmd

        ( TestProduceError, _ ) ->
            model
                |> setProblem (Just (Unspecified [ "Hey", "Problem :)" ]))
                |> setSuccessMessage (Just SuccessForNewUser)
                |> noCmd

        ( TestRenderMath, _ ) ->
            { model | mathRendered = True }
                |> addCmd
                    (renderMath ())

        ( SetPosix posix, _ ) ->
            case model.page of
                Loading ->
                    { model | posix = posix }
                        |> noCmd

                _ ->
                    model |> noCmd

        {- case model.page of
           Loading ->
               let
                   wheelPos =
                       posix
                           |> Time.posixToMillis
                           |> modBy 1000
                           |> toFloat
                           |> (\x -> 2 * pi * x / 1000)
               in
               model
                   |> setLoadingWheel
                       wheelPos
                   |> noCmd

           _ ->
               model |> noCmd
        -}
        ( _, _ ) ->
            --todo
            ( model, Cmd.none )



-- #PageTransition, #setPage, #changePage


eatInvite : Url -> Key -> ( Guest, Cmd Msg )
eatInvite url key =
    let
        inviteParser : Parser.Parser ()
        inviteParser =
            Parser.succeed ()
                |. Parser.token "invite="
                |. Parser.chompUntilEndOr "&"

        isInvite : String -> Bool
        isInvite string =
            case Parser.run inviteParser string of
                Ok _ ->
                    True

                Err _ ->
                    False
    in
    case url.query of
        Just someQuery ->
            let
                queryList =
                    String.split "&" someQuery

                newList =
                    List.filter (isInvite >> not) queryList
            in
            case queryList == newList of
                True ->
                    Guest.init |> noCmd

                False ->
                    case newList of
                        [] ->
                            ( Guest.initFromUrl url
                            , Browser.Navigation.replaceUrl
                                key
                                (Url.toString
                                    { url
                                        | query = Nothing
                                    }
                                )
                            )

                        _ ->
                            ( Guest.initFromUrl url
                            , Browser.Navigation.replaceUrl
                                key
                                (Url.toString
                                    { url
                                        | query = Just (String.join "&" newList)
                                    }
                                )
                            )

        Nothing ->
            Guest.init |> noCmd



{- let
       removeQuery =
           Parser.getChompedString
               (Parser.chompUntilEndOr "?")
   in
   ( Guest.initFromUrl url
   , Browser.Navigation.replaceUrl
       key
       (url
           |> Url.toString
           |> Parser.run removeQuery
           |> Result.toMaybe
           |> Maybe.withDefault (Url.toString url)
       )
   )
-}


openPage : Page -> Model -> ( Model, Cmd Msg )
openPage page model =
    case page of
        Page.ContactInfo ->
            model
                |> removeHints (Field.Guest Field.Name)
                |> removeHints (Field.Guest Field.Email)
                |> setPage page
                |> addCmd focusNameBox

        Page.Bet ->
            model
                |> setPage page
                |> addCmd (updatePlotSize model.plotDomId)

        Page.AccuracyFunction ->
            { model | mathRendered = False }
                |> setPage page
                |> noCmd

        Page.HowToBet ->
            { model | mathRendered = False }
                |> setPage page
                |> noCmd

        Page.RemarksAndDetailedExplanations ->
            { model | mathRendered = False }
                |> setPage page
                |> noCmd

        Page.CheckInvitation ->
            model
                |> setPage page
                |> addCmd focusInviteForm

        --|> addCmd (renderMath ())
        {-
           |> addCmd
               (Cmd.batch
                   [ Task.perform (always TestRenderMath) (Task.succeed ())
                   , Delay.after 1000 TestRenderMath
                   ]
               )
        -}
        _ ->
            model |> setPage page |> noCmd


makeSureItsHome : Model -> ( Model, Cmd Msg )
makeSureItsHome model =
    let
        ( newModel, pageCmd ) =
            openPage Home model

        urlChange =
            case model.url.path of
                "/" ->
                    pageCmd

                _ ->
                    Cmd.batch
                        [ Browser.Navigation.replaceUrl
                            model.key
                            (Url.Builder.absolute [ ".." ] [])
                        , pageCmd
                        ]
    in
    ( newModel, urlChange )


goHome : Model -> Cmd Msg
goHome model =
    Browser.Navigation.pushUrl
        model.key
        (Url.Builder.absolute [ ".." ] [])


replaceWithHome : Model -> Cmd Msg
replaceWithHome model =
    Browser.Navigation.replaceUrl
        model.key
        (Url.Builder.absolute [ ".." ] [])


focusNameBox : Cmd Msg
focusNameBox =
    Task.attempt (\_ -> NoOp) (Browser.Dom.focus "name-box")


focusInviteForm : Cmd Msg
focusInviteForm =
    Task.attempt (\_ -> NoOp) (Browser.Dom.focus "invite-form")


focusEmailBox : Cmd Msg
focusEmailBox =
    Task.attempt (\_ -> NoOp) (Browser.Dom.focus "email-box")


urlWithPasscode : Model -> Url -> Cmd Msg
urlWithPasscode model url =
    case model.user of
        NewUser guest ->
            Cmd.none

        OldUser member ->
            if Passcode.fromUrl url /= Just member.passcode then
                Browser.Navigation.replaceUrl
                    model.key
                    (Url.Builder.relative
                        []
                        [ Url.Builder.string "p" (Passcode.toString member.passcode) ]
                    )

            else
                Cmd.none


maybeFocusContactInputs : Model -> Url -> Cmd Msg
maybeFocusContactInputs model url =
    case Router.toPage url of
        Page.ContactInfo ->
            focusContactInputs model

        _ ->
            Cmd.none


focusContactInputs : Model -> Cmd Msg
focusContactInputs model =
    case ( validateName model, validateEmail model ) of
        ( Nothing, _ ) ->
            Task.attempt (\_ -> NoOp) (Browser.Dom.focus "name-box")

        ( _, Nothing ) ->
            Task.attempt (\_ -> NoOp) (Browser.Dom.focus "email-box")

        ( _, _ ) ->
            Cmd.none



--#UserInput #FieldManipulation


updateFieldValue : Field.Any -> String -> Model -> Model
updateFieldValue field input model =
    case ( field, model.user ) of
        ( Field.Guest guestField, NewUser guest ) ->
            model |> setGuest (Guest.setField guestField input guest)

        ( Field.Guest _, OldUser _ ) ->
            model

        ( Field.Invite, NewUser guest ) ->
            model |> setGuest (Guest.updateInvite input guest)

        ( Field.Invite, _ ) ->
            model

        ( Field.Bet betField, _ ) ->
            model |> updateBet betField input


activateHints : Field.Any -> Model -> ( Model, Cmd Msg )
activateHints field model =
    case field of
        Field.Guest guestField ->
            let
                f =
                    case guestField of
                        Field.Name ->
                            { getCertificate = Guest.getNameCertificate
                            , hint = model.hintNameBox
                            , setHint = \h m -> { m | hintNameBox = h }
                            , getText = Guest.getName
                            , cmdForGood = focusEmailBox
                            }

                        Field.Email ->
                            { getCertificate = Guest.getEmailCertificate
                            , hint = model.hintEmailBox
                            , setHint = \h m -> { m | hintEmailBox = h }
                            , getText = Guest.getEmail
                            , cmdForGood = goHome model
                            }

                oldHint =
                    f.hint

                verbose =
                    { oldHint | verbose = True }

                nextErrorColor =
                    { oldHint | enterOnError = oldHint.enterOnError + 1 }
            in
            case model.user of
                NewUser guest ->
                    case f.getCertificate guest of
                        Certified.Unknown ->
                            if f.getText guest /= "" then
                                model |> f.setHint verbose |> noCmd

                            else
                                model |> noCmd

                        Certified.Checking ->
                            model |> f.setHint verbose |> noCmd

                        Certified.Good ->
                            f.setHint { verbose = False, enterOnError = 0 } model |> addCmd f.cmdForGood

                        Certified.Bad _ ->
                            model |> f.setHint nextErrorColor |> noCmd

                        Certified.Error _ ->
                            certify guestField guest (f.setHint verbose model)

                OldUser member ->
                    model |> noCmd

        Field.Invite ->
            model |> noCmd

        Field.Bet _ ->
            model |> noCmd


removeHints : Field.Any -> Model -> Model
removeHints field model =
    let
        noHints =
            { verbose = False, enterOnError = 0 }
    in
    case field of
        Field.Guest guestField ->
            case guestField of
                Field.Name ->
                    { model | hintNameBox = noHints }

                Field.Email ->
                    { model | hintEmailBox = noHints }

        Field.Invite ->
            model

        Field.Bet _ ->
            model


updateBet : Field.Bet -> String -> Model -> Model
updateBet field input model =
    case field of
        Field.Confidence ->
            model
                |> mapToConfidence (AutoCheck.updateString input)

        Field.Date ->
            model
                |> mapToDate (AutoCheck.updateString input)
                |> mapToPlot AccuracyPlot.removeHighlight


publishBet field model =
    case field of
        Field.Confidence ->
            model
                |> setConfidence
                    (AutoCheck.makePublic model.confidence)
                |> noCmd

        Field.Date ->
            model
                |> setDate (AutoCheck.makePublic model.date)
                |> noCmd


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


tryToSubmitBetForGuest : Model -> ( Model, Cmd Msg )
tryToSubmitBetForGuest model =
    case model.user of
        NewUser guest ->
            case Guest.getInvite guest of
                Nothing ->
                    model
                        |> addCmd
                            (Browser.Navigation.pushUrl
                                model.key
                                (Url.Builder.relative
                                    [ Page.toPath Page.CheckInvitation ]
                                    []
                                )
                            )

                Just invite ->
                    case validateGuestBet model of
                        Just validBet ->
                            { model
                                | inputControl = InputNotAllowed
                                , showSubmitButtonHint = False
                            }
                                |> addCmd (Api.submitBetGuest ProcessSubmitGuest { invite = invite, guest = validBet })

                        Nothing ->
                            model
                                |> setProblem (Just (Unspecified [ "Ahm, I got an error. I thought your bet is valid and you could bit. But then not even a second later I changed my mind (or my model). Can you contact Julian about this?" ]))
                                |> addCmd (goHome model)

        OldUser _ ->
            model
                |> setProblem (Just (Unspecified [ "Wow, not bad. You encoountered a strange error. You're already logged in, but still you made me try to submit a completely new bet. Obviously I cannot do that, but maybe you should contact Julian about this." ]))
                |> addCmd (goHome model)


processGeneralSubmitResponse : ApiResponse Member -> Model -> ( Model, Cmd Msg )
processGeneralSubmitResponse response model =
    case response of
        Success member ->
            case model.user of
                NewUser _ ->
                    model
                        |> setMember member
                        |> setInputControl InputAllowed
                        |> addCmd
                            (Browser.Navigation.pushUrl
                                model.key
                                (Url.Builder.relative
                                    [ Page.toPath Page.ConfirmationSubmitGuest ]
                                    [ Url.Builder.string "p" (Member.passcodeAsString member) ]
                                )
                            )

                OldUser _ ->
                    model
                        |> setMember member
                        |> setInputControl InputAllowed
                        |> noCmd

        Failure issues ->
            model
                |> setProblem (Just (IssuesInBet issues))
                |> setInputControl InputAllowed
                |> addCmd (goHome model)

        ApiError method errors ->
            model
                |> setProblem (Just (Unspecified errors))
                |> setInputControl InputAllowed
                |> addCmd (goHome model)

        ResponseError method errors ->
            model
                |> setProblem (Just (Unspecified errors))
                |> setInputControl InputAllowed
                |> addCmd (goHome model)



-- Waiting


waitForLastInput : Field.Any -> String -> (InputCounter.LastInput -> Msg) -> Model -> ( Model, Cmd Msg )
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

        ( Field.Guest _, OldUser _ ) ->
            False

        ( Field.Invite, NewUser guest ) ->
            InputCounter.match
                field
                lastInput
                ( Maybe.withDefault "" (Guest.getInvite guest), model.inputCounter )

        ( Field.Invite, OldUser _ ) ->
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



--Plot


dateRange : Model -> { min : Date, max : Date }
dateRange model =
    case AutoCheck.object model.date of
        Just date ->
            let
                makeRange =
                    Logic.Utils.dateIntervalWithin { min = startOfBet, max = endOfBet } date
            in
            case model.plotRange of
                Till2022 ->
                    makeRange DateExt.Days 15

                Till2023 ->
                    makeRange DateExt.Months 3

                Till2024 ->
                    { min = startOfBet, max = endOfBet }

        Nothing ->
            { min = startOfBet, max = endOfBet }


updatePlotSize domId =
    Task.attempt UpdatePlotSize (Browser.Dom.getElement domId)



-- ShowSubsections


isVisibleRnDSection : String -> Model -> Bool
isVisibleRnDSection sectionId model =
    Dict.get sectionId model.showRnDSection |> Maybe.withDefault False


setVisibilityRnDSection : String -> Bool -> Model -> Model
setVisibilityRnDSection sectionId visibility model =
    { model
        | mathRendered = False
        , showRnDSection = Dict.insert sectionId visibility model.showRnDSection
    }



-- Validation


convertToMemberBet : Model -> Maybe MemberBet
convertToMemberBet model =
    case ( AutoCheck.publicObject model.confidence, AutoCheck.publicObject model.date ) of
        ( Just confidence, Just date ) ->
            Just { confidence = confidence, date = date }

        ( _, _ ) ->
            Nothing


validateMemberBet : Model -> Maybe { passcode : Passcode, confidence : Valid Confidence, date : Valid Date }
validateMemberBet model =
    case ( model.inputControl, model.user ) of
        ( InputAllowed, OldUser member ) ->
            case Just (Member.getBet member) /= convertToMemberBet model of
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
    case model.inputControl of
        InputAllowed ->
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

                OldUser member ->
                    Nothing

        InputNotAllowed ->
            Nothing


validateName : Model -> Maybe (Valid String)
validateName model =
    case model.user of
        NewUser guest ->
            Valid.fromCertified (Guest.getCertifiedName guest)

        OldUser _ ->
            Nothing


validateEmail : Model -> Maybe (Valid String)
validateEmail model =
    case model.user of
        NewUser guest ->
            Valid.fromCertified (Guest.getCertifiedEmail guest)

        OldUser _ ->
            Nothing


validateConfidence : Model -> Maybe (Valid Confidence)
validateConfidence model =
    Valid.fromAutoChecking model.confidence


validateDate : Model -> Maybe (Valid Date)
validateDate model =
    Valid.fromAutoChecking model.date



--Rest


onUrlRequest : Browser.UrlRequest -> Msg
onUrlRequest =
    ProcessUrlRequest


onUrlChange : Url -> Msg
onUrlChange =
    ProcessUrlChange


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ --todo
          Browser.Events.onResize (\_ _ -> RequestPlotSizeUpdate)
        , case model.mathRendered == False of
            True ->
                Browser.Events.onAnimationFrame (\_ -> TestRenderMath)

            False ->
                Sub.none

        --, Browser.Events.onAnimationFrame SetPosix
        ]


port renderMath : () -> Cmd msg
