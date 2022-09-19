module Page.WhatIsNoMaskDay exposing (..)

import Element exposing (..)
import Element.Border as Border
import Element.Font as Font
import Logic.Logic exposing (..)
import Ui.CustomElements as CustomEl
import Ui.Palette.Color as Color
import Ui.Palette.Distance as Distance


view : Model -> Element Msg
view model =
    CustomEl.explanationPage CustomEl.colorWhatIsNoMaskDay
        [ el [ Font.bold ] (text "What is No-Mask-Day")
        , textColumn [ fill |> width ]
            [ paragraph []
                [ text "No-Mask-Day is the idea of the celebratory day when we don't have to wear masks anymore in our everyday lives. To bet on No-Mask-Day we need a formal definition:" ]
            , paragraph
                [ { top = Distance.M |> Distance.translate
                  , right = 0
                  , bottom = Distance.M |> Distance.translate
                  , left = Distance.B |> Distance.translate
                  }
                    |> paddingEach
                ]
                [ text "No-Mask-Day is the fist day¹ on which everybody² can travel the Frankfurt-Berlin route by train³ without being legally required to wear a mask at any time." ]
            ]
        , textColumn [ fill |> width, alignBottom ]
            [ paragraph [ alignBottom ] [ text "¹: One day without a mask counts as the No-Mask-Day. Even if we have to go into full lockdown on the very next day." ] ]
        , textColumn [ fill |> width, alignBottom ]
            [ paragraph [ alignBottom ] [ text "²: No matter if vaccinated or unvaccinated" ] ]
        , textColumn [ fill |> width, alignBottom ]
            [ paragraph [] [ text "³: the regular ICE connection that passes through Berlin, Brandenburg, Saxony-Anhalt, Thuringia and Hesse." ]
            ]
        ]
