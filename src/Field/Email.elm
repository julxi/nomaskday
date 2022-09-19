module Field.Email exposing (..)

import Json.Decode as Decode exposing (Decoder)
import Json.Encode as Encode exposing (Value)


type alias Email =
    String


encode : Email -> ( String, Value )
encode email =
    ( "email", Encode.string email )


decoder : Decoder Email
decoder =
    Decode.field "email" Decode.string


compareEncoding : Value -> Email -> Bool
compareEncoding value email =
    Encode.object [ encode email ] == value
