module Page.HowToBet exposing (..)

import Element exposing (..)
import Element.Border as Border
import Element.Font as Font
import Logic.Logic exposing (..)
import Ui.CustomElements as CustomEl
import Ui.Palette.Color as Color
import Ui.Palette.Distance as Distance


zeroEach =
    CustomEl.noBorder


paddingList =
    paddingEach { zeroEach | left = Distance.B |> Distance.translate }


view : Model -> Element Msg
view model =
    CustomEl.explanationPage CustomEl.colorHowToBet
        [ el [ Font.bold ] (text "How does the No-Mask-Day bet work?")
        , column
            [ fill |> width
            , Distance.B |> Distance.translate |> spacing
            ]
            [ paragraph []
                [ text "We bet money here! When you made your bet and the No-Mask-Day happened you win money if your bet was more accurate than average and loose money otherwise." ]
            , column [ Distance.S |> Distance.translate |> spacing ]
                [ paragraph []
                    [ text "Your bet consists of two data:" ]
                , paragraph [ paddingList ]
                    [ text "1. Your "
                    , el [ Font.bold ] (text "date")
                    , text ", a guess for the day on which the No-Mask-Day will take place."
                    ]
                , paragraph [ paddingList ]
                    [ text "2. Your "
                    , el [ Font.bold ] (text "confidence")
                    , text ", a number betwenn 0% and 100%."
                    ]
                , paragraph []
                    [ text "These two datas togeher determine your "
                    , CustomEl.boldFont "accuracy"
                    , text " on the No-Mask-Day."
                    ]
                ]
            , paragraph []
                [ text "Let's postpone the calculation of the accuracy to the next explanation box and talk about the money. You earn/loose the difference between your accuracy and the average accuracy multiplied by 200€, e.g., if your accuracy were 0.55 and the average were 0.38 then you would earn (0.55-0.38)*200€ = 34€." ]
            , column [ Distance.S |> Distance.translate |> spacing ]
                [ paragraph []
                    [ text "That's all except for some final remarks:" ]
                , paragraph [ paddingList ]
                    [ text "-> If the No-Mask-Day doesn't happen within 2022-2024, the bet is canceled. No No-Mask-Day, no fun :("
                    ]
                , paragraph [ paddingList ]
                    [ text "-> Your username and your bet will be made public here on January 1st, 2022 (but don't worry, your email will never be shared)"
                    ]
                , paragraph [ paddingList ]
                    [ text "-> This is a fun project. Please only bet if you feel like it and enjoy doing so :)"
                    ]
                ]
            ]
        ]
