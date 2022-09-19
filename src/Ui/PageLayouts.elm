module Ui.PageLayouts exposing (..)

import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Font as Font
import Element.Input as Input
import Logic.Page as Page exposing (..)
import Logic.Router as Router exposing (..)
import Ui.Palette.Color as Color
import Ui.Palette.Distance as Distance
import Ui.Palette.FontSize as FontSize


basicPageLayout =
    [ width fill
    , height fill
    , Color.Black |> Color.translate |> Background.color
    , Color.White |> Color.translate |> Font.color
    , FontSize.M |> FontSize.translate |> Font.size
    ]


home : Element msg -> List (Element msg) -> Element msg
home overlay content =
    column
        (inFront overlay
            :: basicPageLayout
        )
        [ el
            [ width fill
            , FontSize.XXB |> FontSize.translate |> Font.size
            , Font.bold
            , Color.White |> Color.translate |> Font.color
            , Color.Black |> Color.translate |> Background.color
            , Distance.B |> Distance.translate |> padding
            , Border.widthEach
                { bottom = 1
                , left = 0
                , right = 0
                , top = 0
                }
            , Color.White |> Color.translate |> Border.color
            ]
            (text "No-Mask-Day bet!")
        , column
            [ width fill
            , height fill
            , Distance.B |> Distance.translate |> padding
            ]
            content
        ]


messageOverlay : List (Element msg) -> Element msg
messageOverlay messages =
    el
        (basicPageLayout
            ++ [ Background.image
                    "../images/static_noise.png"
               ]
        )
        (el
            [ width fill
            , height fill
            , Color.Black
                |> Color.translateAlpha 0.85
                |> Background.color
            ]
            (column
                [ centerY
                , width fill
                , Distance.XXXXB
                    |> Distance.translate
                    |> spacing
                ]
                messages
            )
        )
