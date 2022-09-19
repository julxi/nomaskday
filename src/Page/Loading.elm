module Page.Loading exposing (..)

import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Logic.Logic exposing (..)
import Time
import Ui.Palette.Color as Color


view : Model -> Element Msg
view model =
    let
        loadingWheel =
            model.posix
                |> Time.posixToMillis
                |> modBy 10000
                |> toFloat
                |> (\x -> 2 * pi * x / 10000)
    in
    el
        [ width fill
        , height fill
        , Color.Black |> Color.translate |> Background.color

        {- , Background.gradient
           { angle = loadingWheel
           , steps =
               List.map (Color.translateAlpha 0.9)
                   [ Color.NeonPurple
                   , Color.NeonBlue
                   , Color.NeonYellow
                   , Color.NeonOrange
                   , Color.NeonRed
                   , Color.NeonFuschia
                   , Color.NeonGreen
                   ]
           }
        -}
        ]
        (el
            [ centerX
            , centerY
            , 100 |> px |> width
            , 100 |> px |> height
            , Border.rounded 100
            , rotate
                -(loadingWheel * 10)
            , Background.gradient
                { angle = pi / 3
                , steps =
                    List.map (Color.translateAlpha 0.9)
                        [ Color.NeonPurple
                        , Color.NeonBlue
                        , Color.NeonYellow
                        , Color.NeonOrange
                        , Color.NeonRed
                        , Color.NeonFuschia
                        , Color.NeonGreen
                        ]
                }
            ]
            Element.none
        )



--Animator.loop : Duration -> Oscillator -> Movement
--Duration = slowely / verySlowly
--Oscillator = wrap 0 2*pi
