module Logic.InputCounter exposing (..)

import Field.Field as Field


type alias InputCounter =
    { name : Counter
    , email : Counter
    , confidence : Counter
    , date : Counter
    , invite : Counter
    }


init : InputCounter
init =
    { name = 0
    , email = 0
    , confidence = 0
    , date = 0
    , invite = 0
    }


type alias Counter =
    Int


type alias LastInput =
    { input : Input, counter : Counter }


type alias Input =
    String


get : Field.Any -> InputCounter -> Counter
get field inputCounter =
    case field of
        Field.Guest Field.Name ->
            inputCounter.name

        Field.Guest Field.Email ->
            inputCounter.email

        Field.Bet Field.Confidence ->
            inputCounter.confidence

        Field.Bet Field.Date ->
            inputCounter.date

        Field.Invite ->
            inputCounter.invite


update : Field.Any -> Counter -> InputCounter -> InputCounter
update field counter inputCounter =
    case field of
        Field.Guest Field.Name ->
            { inputCounter | name = counter }

        Field.Guest Field.Email ->
            { inputCounter | email = counter }

        Field.Bet Field.Confidence ->
            { inputCounter | confidence = counter }

        Field.Bet Field.Date ->
            { inputCounter | date = counter }

        Field.Invite ->
            { inputCounter | invite = counter }


newInput : Field.Any -> Input -> InputCounter -> ( InputCounter, LastInput )
newInput field input inputCounter =
    let
        newCounter : Counter
        newCounter =
            (get field inputCounter + 1) |> modBy 255

        newLastInput : LastInput
        newLastInput =
            { input = input, counter = newCounter }
    in
    ( update field newCounter inputCounter, newLastInput )


match : Field.Any -> LastInput -> ( Input, InputCounter ) -> Bool
match field lastInput ( modelInput, inputCounter ) =
    lastInput.counter == get field inputCounter && lastInput.input == modelInput
