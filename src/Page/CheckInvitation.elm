module Page.CheckInvitation exposing (..)

import Element exposing (..)
import Element.Border as Border
import Element.Font as Font
import Element.Input
import Field.Field as Field
import Html.Attributes
import Logic.Logic exposing (..)
import Ui.CustomElements as CustomEl
import Ui.Palette.Color as Color
import Ui.Palette.Distance as Distance
import User.Guest as Guest exposing (Guest, Invite(..))
import User.User exposing (User(..))
import Valid.Certified as Certified


view : Model -> Element Msg
view model =
    case model.user of
        NewUser guest ->
            CustomEl.explanationPage CustomEl.colorWhatIsNoMaskDay
                [ el [ Font.bold ] (text "Can I see your invite?")
                , textColumn [ fill |> width ]
                    [ paragraph []
                        [ text "To make sure, that you are friend or family I need your personal invitation code" ]
                    ]
                , el [ width fill ] (inviteForm guest model)
                ]

        OldUser member ->
            text "This is not a place for members like you!"


inviteForm : Guest -> Model -> Element Msg
inviteForm guest model =
    Element.Input.text
        (CustomEl.formStyle
            ++ [ Element.below (hintMessage (Guest.getFullInvite guest))
               , focused CustomEl.focusedBox
               , width fill
               , htmlAttribute (Html.Attributes.id "invite-form")
               ]
        )
        { onChange = Input Field.Invite
        , text = Maybe.withDefault "" (Guest.getInvite guest)
        , placeholder =
            Just
                (Element.Input.placeholder
                    []
                    (text "your invitation code")
                )
        , label = Element.Input.labelHidden "Invite"
        }


hintMessage : Invite -> Element msg
hintMessage invite =
    let
        zeroEach =
            CustomEl.zeroEach
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
        (case invite of
            NoInvite ->
                []

            PossiblyInvite _ ->
                []

            FailedInvite _ issue ->
                [ paragraph [] [ text issue ]
                , paragraph [] [ text "Maybe you have a typo?" ]
                ]
        )
