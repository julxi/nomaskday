module Page.ContactInfo exposing (..)

import Array
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Font as Font
import Element.Input
import Field.Field as Field
import Html.Attributes
import Logic.Logic exposing (..)
import Logic.Router as Router exposing (..)
import Ui.CustomElements as CustomEl
import Ui.Palette.Color as Color
import Ui.Palette.Distance as Distance
import Ui.Palette.FontSize as FontSize
import User.Guest as Guest exposing (Guest)
import User.Member as Member
import User.User as User exposing (User(..))
import Valid.Certified as Certified
import Valid.Valid


view : Model -> Element Msg
view model =
    (case model.user of
        NewUser guest ->
            row [ alignTop, width fill ]
                [ el [ width fill ] none
                , nameForm guest model
                , el [ width fill ] none
                , emailForm guest model
                , el [ width fill ] none

                {- , CustomEl.basicButton
                       FinshEnteringContactInfo
                       Distance.B
                       Color.NeonFuschia
                       "bla"
                   , guestForm Field.Email guest
                -}
                ]

        OldUser member ->
            text "You shouldn't be here O.o"
    )
        |> CustomEl.contactLayout


nameForm : Guest -> Model -> Element Msg
nameForm guest model =
    Element.Input.text
        (CustomEl.formStyle
            ++ (case validateName model of
                    Just _ ->
                        [ Color.NeonFuschia |> Color.translate |> Font.color ]

                    Nothing ->
                        []
               )
            ++ [ htmlAttribute (Html.Attributes.id "name-box")
               , Element.below (hintMessage Field.Name guest model)
               , EnterOnNameBox
                    |> CustomEl.onEnter
               , BlurOnBox (Field.Guest Field.Name)
                    |> CustomEl.onBlur
               , focused CustomEl.focusedBox
               ]
        )
        { onChange = Input (Field.Guest Field.Name)
        , text = Guest.getName guest
        , placeholder =
            Just
                (Element.Input.placeholder
                    []
                    (text "your name")
                )
        , label = Element.Input.labelHidden "Name"
        }


emailForm : Guest -> Model -> Element Msg
emailForm guest model =
    Element.Input.email
        (CustomEl.formStyle
            ++ (case validateEmail model of
                    Just _ ->
                        [ Color.NeonFuschia |> Color.translate |> Font.color ]

                    Nothing ->
                        []
               )
            ++ [ htmlAttribute (Html.Attributes.id "email-box")
               , Element.below (hintMessage Field.Email guest model)
               , EnterOnEmailBox
                    |> CustomEl.onEnter
               , BlurOnBox (Field.Guest Field.Email)
                    |> CustomEl.onBlur
               , focused CustomEl.focusedBox
               ]
        )
        { onChange = Input (Field.Guest Field.Email)
        , text = Guest.getEmail guest
        , placeholder =
            Just
                (Element.Input.placeholder
                    []
                    (text "your e-mail")
                )
        , label = Element.Input.labelHidden "Email"
        }


hintMessage : Field.Guest -> Guest -> Model -> Element msg
hintMessage field guest model =
    let
        zeroEach =
            CustomEl.noBorder

        f =
            case field of
                Field.Name ->
                    { certificate = Guest.getNameCertificate guest
                    , verbose = model.hintNameBox.verbose
                    , issueText = "please change your name:"
                    , colorWheelCount = model.hintNameBox.enterOnError
                    }

                Field.Email ->
                    { certificate = Guest.getEmailCertificate guest
                    , verbose = model.hintEmailBox.verbose
                    , issueText = "please change your email:"
                    , colorWheelCount = model.hintEmailBox.enterOnError
                    }
    in
    textColumn
        [ 150 |> px |> width
        , Color.White
            |> Color.translate
            |> Font.color
        , Distance.M
            |> Distance.translate
            |> spacing
        , paddingEach
            { zeroEach
                | top = Distance.S |> Distance.translate
            }
        ]
        (case ( f.certificate, f.verbose ) of
            ( Certified.Unknown, True ) ->
                [ paragraph [] [ text "i'm checking..." ] ]

            ( Certified.Checking, True ) ->
                [ paragraph [] [ text "i'm checking..." ] ]

            ( Certified.Good, True ) ->
                [ paragraph [] [ text "ok, please confirm again" ] ]

            ( Certified.Bad issues, _ ) ->
                List.map
                    (\t ->
                        paragraph
                            [ enterCountToColor f.colorWheelCount
                                |> Color.translate
                                |> Font.color
                            ]
                            [ text t ]
                    )
                    (f.issueText
                        :: List.map ((++) "• ") issues
                    )

            ( Certified.Error errors, _ ) ->
                List.map
                    (\t ->
                        paragraph [] [ text t ]
                    )
                    ("ups... there is an error:"
                        :: List.map ((++) "• ") errors
                    )

            ( _, _ ) ->
                []
        )


enterCountToColor : Int -> Color.Color
enterCountToColor cnt =
    let
        colorWheel =
            Array.fromList [ Color.White, Color.NeonRed, Color.NeonOrange, Color.NeonGreen, Color.NeonFuschia, Color.NeonBlue ]

        nextColor =
            modBy 4 cnt
    in
    Maybe.withDefault Color.NeonRed (Array.get nextColor colorWheel)


beautifyCertificate : Bool -> Certified.Certificate -> Element msg
beautifyCertificate verbose certificate =
    Element.paragraph [ 150 |> px |> width ]
        [ case certificate of
            Certified.Unknown ->
                Element.none

            Certified.Checking ->
                Element.text "➿➿➿➿➿"

            Certified.Good ->
                Element.text "Take it!"

            Certified.Bad issueList ->
                (Element.text "❌: " :: List.map Element.text issueList) |> Element.column []

            Certified.Error errorList ->
                (Element.text "Errors: " :: List.map Element.text errorList) |> Element.column []
        ]
