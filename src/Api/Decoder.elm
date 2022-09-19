module Api.Decoder exposing (decodeErrors, decodeIssues, decodeStatus)

import Array
import Json.Decode as Decode exposing (Decoder, Value, decodeString, field, string)


decodeStatus : Decoder String
decodeStatus =
    Decode.field "status" Decode.string


decodeErrors : Decoder (List String)
decodeErrors =
    Decode.map
        Array.toList
        (Decode.field "errors" (Decode.array Decode.string))


decodeIssues : Decoder (List String)
decodeIssues =
    Decode.map
        Array.toList
        (Decode.field "issues" (Decode.array Decode.string))
