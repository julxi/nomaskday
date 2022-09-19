module Ui.Palette.FontSize exposing (..)

import Element
import Round


type Size
    = M
    | B
    | XB
    | XXB
    | XXXB
    | XXXXB
    | S
    | XS
    | XXS
    | XXXS


translate : Size -> Int
translate size =
    let
        m =
            16

        fontSize =
            Element.modular 16 1.25 >> Round.truncate
    in
    case size of
        M ->
            fontSize 1

        B ->
            fontSize 2

        XB ->
            fontSize 3

        XXB ->
            fontSize 4

        XXXB ->
            fontSize 5

        XXXXB ->
            fontSize 6

        S ->
            fontSize -1

        XS ->
            fontSize -2

        XXS ->
            fontSize -3

        XXXS ->
            fontSize -4
