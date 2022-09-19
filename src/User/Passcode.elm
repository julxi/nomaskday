module User.Passcode exposing (..)

import Field.Confidence exposing (Confidence)
import Field.Date exposing (Date)
import Json.Decode as Decode exposing (Decoder)
import Json.Encode as Encode exposing (Value)
import Url exposing (Url)
import Url.Parser
import Url.Parser.Query


type Passcode
    = Passcode String


fromUrl : Url -> Maybe Passcode
fromUrl url =
    let
        normalizedUrl =
            { url | path = "" }
    in
    case Url.Parser.parse (Url.Parser.query (Url.Parser.Query.string "p")) normalizedUrl of
        Just (Just passcode) ->
            Just (Passcode passcode)

        _ ->
            Nothing


toLink : Passcode -> String
toLink (Passcode passcode) =
    "https://no-mask-day.com/?p=" ++ passcode


encode : Passcode -> ( String, Value )
encode (Passcode token) =
    ( "passcode", Encode.string token )


decode : Decoder Passcode
decode =
    Decode.map
        Passcode
        (Decode.field "passcode" Decode.string)


toString : Passcode -> String
toString (Passcode str) =
    str
