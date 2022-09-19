module Field.Date exposing (..)

import Date
import Json.Decode as Decode exposing (Decoder)
import Json.Encode as Encode exposing (Value)
import Time exposing (Month(..))


type alias Date =
    Date.Date


encode : Date -> ( String, Value )
encode date =
    ( "date"
    , Encode.object
        [ ( "year", Encode.int (Date.year date) )
        , ( "month", Encode.int (Date.monthNumber date) )
        , ( "day", Encode.int (Date.day date) )
        ]
    )


decode : Decoder Date
decode =
    let
        constructor : Int -> Int -> Int -> Date
        constructor year month day =
            Date.fromCalendarDate
                year
                (Date.numberToMonth month)
                day
    in
    Decode.field "date"
        (Decode.map3
            constructor
            (Decode.field "year" Decode.int)
            (Decode.field "month" Decode.int)
            (Decode.field "day" Decode.int)
        )


toString : Date -> String
toString =
    Date.toIsoString


toPrettyString : Date -> String
toPrettyString =
    Date.format "MMMM ddd, y"


fromString : String -> Maybe Date
fromString =
    Result.toMaybe << Date.fromIsoString


fromOrdinalDate =
    Date.fromOrdinalDate


fromCalendarDate : Int -> Int -> Int -> Date
fromCalendarDate year month day =
    Date.fromCalendarDate year (Date.numberToMonth month) day
