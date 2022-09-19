module Valid.AutoCheck exposing (..)

import Field.Confidence as Confidence exposing (Confidence)
import Field.Date as Date exposing (Date)
import Json.Encode exposing (Value)


type AutoChecking object
    = AutoChecking
        { string : String
        , check : Maybe object
        , isCheckOfficial : Bool
        , translator : Translator object
        }


type alias Translator object =
    { toString : object -> String
    , fromString : String -> Maybe object
    }


type PublicState
    = Unknown
    | Good
    | Bad


initFromString : (object -> String) -> (String -> Maybe object) -> String -> AutoChecking object
initFromString toString fromString str =
    let
        translator =
            { toString = toString, fromString = fromString }
    in
    AutoChecking
        { string = str
        , check = fromString str
        , isCheckOfficial = False
        , translator = translator
        }


initFromObject : (object -> String) -> (String -> Maybe object) -> object -> AutoChecking object
initFromObject toString fromString obj =
    let
        translator =
            { toString = toString, fromString = fromString }
    in
    AutoChecking
        { string = toString obj
        , check = Just obj
        , isCheckOfficial = True
        , translator = translator
        }


updateString : String -> AutoChecking object -> AutoChecking object
updateString str (AutoChecking auto) =
    AutoChecking { auto | string = str, check = auto.translator.fromString str, isCheckOfficial = False }


updateObject : object -> AutoChecking object -> AutoChecking object
updateObject obj (AutoChecking auto) =
    AutoChecking
        { auto
            | string = auto.translator.toString obj
            , check = Just obj
            , isCheckOfficial = True
        }


makePublic : AutoChecking object -> AutoChecking object
makePublic (AutoChecking auto) =
    AutoChecking { auto | isCheckOfficial = True }


publicState : AutoChecking object -> PublicState
publicState (AutoChecking auto) =
    case auto.isCheckOfficial of
        True ->
            case auto.check of
                Just _ ->
                    Good

                Nothing ->
                    Bad

        False ->
            Unknown


publicObject : AutoChecking object -> Maybe object
publicObject (AutoChecking auto) =
    case auto.isCheckOfficial of
        True ->
            auto.check

        False ->
            Nothing


string : AutoChecking object -> String
string (AutoChecking auto) =
    auto.string


object : AutoChecking object -> Maybe object
object (AutoChecking auto) =
    auto.check
