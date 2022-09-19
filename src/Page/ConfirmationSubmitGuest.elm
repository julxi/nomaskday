module Page.ConfirmationSubmitGuest exposing (..)

import Element exposing (..)
import Element.Font as Font
import Logic.Logic exposing (..)
import Ui.CustomElements as CustomEl
import Ui.Palette.Color as Color
import Ui.Palette.Distance as Distance
import Ui.Palette.FontSize as FontSize
import User.Member as Member
import User.Passcode as Passcode
import User.User exposing (..)


view : Model -> Element Msg
view model =
    case model.user of
        OldUser member ->
            CustomEl.explanationPage Color.NeonOrange
                [ el
                    [ Font.bold
                    , FontSize.B
                        |> FontSize.translate
                        |> Font.size
                    ]
                    (text "Great! Your bet has been submitted!")
                , textColumn
                    [ fill |> width
                    , Distance.M
                        |> Distance.translate
                        |> spacing
                    ]
                    [ paragraph []
                        [ text "Welcome to the party "
                        , member |> Member.getName |> text
                        , text "! Your bet has been sent sucessfully."
                        ]
                    , column [ Distance.XXS |> Distance.translate |> spacing ]
                        [ paragraph []
                            [ text "You can change your bet anytime under this link:" ]
                        , paragraph
                            [ Font.center
                            , Distance.B |> Distance.translate |> padding
                            ]
                            [ let
                                memberLink =
                                    member
                                        |> Member.getPasscode
                                        |> Passcode.toLink
                              in
                              Element.link []
                                { url = memberLink
                                , label =
                                    el
                                        [ Color.NeonOrange |> Color.translate |> Font.color
                                        , Font.underline
                                        ]
                                        (text memberLink)
                                }
                            ]
                        ]
                    , paragraph []
                        [ text "I also just sent you the link via e-mail." ]
                    ]
                , el [ centerX ]
                    (CustomEl.basicButton
                        GoHome
                        Distance.M
                        Color.NeonOrange
                        "kk."
                    )
                ]

        NewUser guest ->
            CustomEl.explanationPage Color.NeonRed
                [ el [ Font.bold ] (text "What?! How did you get here?")
                , textColumn
                    [ fill |> width ]
                    [ paragraph []
                        [ text "Strange, I don't know you but still you are here. Can you perhaps tell me how you managed to do that?"
                        ]
                    , paragraph []
                        [ text "That would be great :)" ]
                    ]
                ]
