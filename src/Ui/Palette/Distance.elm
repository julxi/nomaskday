module Ui.Palette.Distance exposing (..)


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
    case size of
        M ->
            8

        B ->
            13

        XB ->
            21

        XXB ->
            34

        XXXB ->
            55

        XXXXB ->
            89

        S ->
            5

        XS ->
            3

        XXS ->
            2

        XXXS ->
            1
