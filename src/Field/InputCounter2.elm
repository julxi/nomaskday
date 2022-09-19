module Field.InputCounter exposing (..)

import Dict exposing (Dict)


type alias InputCounter =
    Dict Field Counter


type alias Field =
    String


type alias Counter =
    Int


type alias LastInput =
    { input : Input, counter : Counter }


type alias Input =
    String


init : InputCounter
init =
    Dict.empty


newInput : Field -> Input -> InputCounter -> ( InputCounter, LastInput )
newInput field input inputCounter =
    let
        newCounter =
            case Dict.get input inputCounter of
                Just counter ->
                    (counter + 1) |> modBy 1023

                Nothing ->
                    0

        newLastInput =
            { input = input, counter = newCounter }
    in
    ( Dict.update
        field
        (\_ -> Just newCounter)
        inputCounter
    , newLastInput
    )


match : Field -> LastInput -> ( Input, InputCounter ) -> Bool
match field lastInput ( modelInput, inputCounter ) =
    case Dict.get field inputCounter of
        Just counter ->
            lastInput.counter == counter && lastInput.input == modelInput

        Nothing ->
            False
