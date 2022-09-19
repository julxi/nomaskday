module Page.AccuracyFunction exposing (..)

import Date as DateExt
import Element exposing (..)
import Element.Font as Font
import Field.Date as Date
import Katex
import Logic.Logic exposing (..)
import Ui.CustomElements as CustomEl
import Ui.Palette.Color as Color
import Ui.Palette.Distance as Distance


dateGuessed =
    Date.fromCalendarDate 2022 8 1


dateNMD =
    Date.fromCalendarDate 2022 10 10


view : Model -> Element Msg
view model =
    CustomEl.explanationPage CustomEl.colorAccuracyFunction
        [ el [ Font.bold ] (text "How is my accuracy computed?")
        , textColumn
            [ fill |> width
            , Distance.M |> Distance.translate |> spacing
            ]
            [ paragraph []
                [ text
                    "Let's say you guessed "
                , dateGuessed |> Date.toPrettyString |> text
                , text
                    " with a confidence of 34% and the No-Mask-Day falls on "
                , dateNMD |> Date.toPrettyString |> text
                , text ". What is your accuracy then? Easy! Just plug in the numbers into this formula"
                ]
            , paragraph [ Font.center ]
                [ "c \\cdot \\exp\\bigg(-\\left( \\frac{c \\cdot \\Delta d}{36} \\right)^2\\bigg) + \\frac{1 - c}{4}"
                    |> Katex.display
                    |> Katex.print
                    |> text
                ]
            , paragraph []
                [ text "where "
                , "c" |> Katex.inline |> Katex.print |> text
                , text " is your confidence as decimal number and "
                , "\\Delta d" |> Katex.inline |> Katex.print |> text
                , text " the differenc in days between your guessed date and the actual No-Mask-Day. So in our example we have "
                , "c = 0.34" |> Katex.inline |> Katex.print |> text
                , text " and "
                , ("\\Delta d = "
                    ++ String.fromInt (DateExt.toRataDie dateNMD - DateExt.toRataDie dateGuessed)
                  )
                    |> Katex.inline
                    |> Katex.print
                    |> text
                , text ". That checks out to be an accuracy of roughly 0.38."
                ]
            , paragraph []
                [ text "Ok... maybe it's not that easy. But you don't have to understand this formula in order to bet. The page for filling in the details of your bet shows you a plot of the accuracy for every day. Just play with it! You will quickly get a feel for it." ]
            ]
        ]
