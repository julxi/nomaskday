module Ui.Palette.Color exposing (..)

import Dict
import Element exposing (rgb255, rgba255)
import Hex


type Color
    = Background
    | Highlight
    | FontNormal
    | FontLight
    | Neutral
    | NeutralDark
      -- pure Colors
    | Black
    | White
    | VeryGray
    | NeonPurple
    | NeonBlue
    | NeonYellow
    | NeonOrange
    | NeonRed
    | NeonFuschia
    | NeonGreen


toTuple : Color -> ( Int, Int, Int )
toTuple color =
    case color of
        Background ->
            ( 0, 0, 0 )

        Neutral ->
            ( 55, 64, 69 )

        NeutralDark ->
            ( 44, 6, 31 )

        FontNormal ->
            ( 0xFF, 0xFF, 0xFF )

        FontLight ->
            ( 255, 216, 159 )

        Highlight ->
            ( 216, 146, 22 )

        Black ->
            ( 0, 0, 0 )

        White ->
            ( 255, 255, 255 )

        VeryGray ->
            ( 151, 153, 155 )

        NeonPurple ->
            ( 199, 35, 177 )

        NeonBlue ->
            ( 77, 77, 255 )

        NeonYellow ->
            ( 224, 231, 34 )

        NeonOrange ->
            ( 255, 173, 0 )

        NeonRed ->
            ( 210, 39, 48 )

        NeonFuschia ->
            ( 219, 62, 177 )

        NeonGreen ->
            ( 68, 214, 44 )


translate : Color -> Element.Color
translate color =
    let
        ( r, g, b ) =
            toTuple color
    in
    rgb255 r g b


translateAlpha : Float -> Color -> Element.Color
translateAlpha a color =
    let
        ( r, g, b ) =
            toTuple color
    in
    rgba255 r g b a


toString : Color -> String
toString color =
    let
        ( r, g, b ) =
            toTuple color
    in
    "#"
        ++ padLeft 2 '0' (Hex.toString r)
        ++ padLeft 2 '0' (Hex.toString g)
        ++ padLeft 2 '0' (Hex.toString b)


basicColor : String -> Element.Color
basicColor name =
    let
        colorDict =
            Dict.fromList
                [ ( "black", ( 0, 0, 0 ) )
                , ( "white", ( 255, 255, 255 ) )
                , ( "red", ( 255, 0, 0 ) )
                , ( "lime", ( 0, 255, 0 ) )
                , ( "blue", ( 0, 0, 255 ) )
                , ( "yellow", ( 255, 255, 0 ) )
                , ( "cyan", ( 0, 255, 255 ) )
                , ( "magenta", ( 255, 0, 255 ) )
                , ( "silver", ( 192, 192, 192 ) )
                , ( "gray", ( 128, 128, 128 ) )
                , ( "maroon", ( 128, 0, 0 ) )
                , ( "olive", ( 128, 128, 0 ) )
                , ( "green", ( 0, 128, 0 ) )
                , ( "purple", ( 128, 0, 128 ) )
                , ( "teal", ( 0, 128, 128 ) )
                , ( "navy", ( 0, 0, 128 ) )
                ]
    in
    case Dict.get name colorDict of
        Just ( r, g, b ) ->
            rgb255 r g b

        Nothing ->
            rgb255 0 0 0


padLeft : Int -> Char -> String -> String
padLeft len c s =
    let
        sLen =
            String.length s

        rep =
            len - sLen
    in
    if rep > 0 then
        String.repeat rep (String.fromChar c) ++ s

    else
        s
