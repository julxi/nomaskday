module Logic.Utils exposing (..)

import Date exposing (Date)


addCmd : cmd -> model -> ( model, cmd )
addCmd msgCmd model =
    ( model, msgCmd )


noCmd : model -> ( model, Cmd msg )
noCmd model =
    ( model, Cmd.none )


pairs : List a -> List b -> List ( a, b )
pairs xs ys =
    List.map2 Tuple.pair xs ys


getLast : List a -> Maybe a
getLast list =
    List.foldl (\a b -> Just a) Nothing list


avg : List Float -> Float
avg l =
    let
        avgFolder : number -> ( number, number ) -> ( number, number )
        avgFolder n ( count, total ) =
            ( count + 1, total + n )
    in
    l
        |> List.foldl avgFolder ( 0, 0 )
        |> (\( c, t ) -> t / c)


dateIntervalWithin : { min : Date, max : Date } -> Date -> Date.Unit -> Int -> { min : Date, max : Date }
dateIntervalWithin borders date unit length =
    let
        left =
            Date.add unit (2 * length) borders.min

        right =
            Date.add unit (-2 * length) borders.max
    in
    { min = Date.max (Date.min right (Date.add unit -length date)) borders.min
    , max = Date.min (Date.max left (Date.add unit length date)) borders.max
    }
