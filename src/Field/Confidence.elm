module Field.Confidence exposing (..)

import Json.Decode as Decode exposing (Decoder)
import Json.Encode as Encode exposing (Value)


type Confidence
    = Confidence Int


encode : Confidence -> ( String, Value )
encode (Confidence int) =
    ( "spread", Encode.int int )


decode : Decoder Confidence
decode =
    let
        constructor : Int -> Confidence
        constructor int =
            if int < 0 then
                Confidence 0

            else if int <= 100 then
                Confidence int

            else
                Confidence 100
    in
    Decode.map
        constructor
        (Decode.field "spread" Decode.int)


default : Confidence
default =
    Confidence 100


fromInt : Int -> Maybe Confidence
fromInt int =
    if int < 0 then
        Nothing

    else if 100 < int then
        Nothing

    else
        Just (Confidence int)


fromString : String -> Maybe Confidence
fromString str =
    String.toInt str |> Maybe.andThen fromInt


toInt : Confidence -> Int
toInt (Confidence int) =
    int


toString : Confidence -> String
toString =
    toInt >> String.fromInt
