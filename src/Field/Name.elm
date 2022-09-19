module Field.Name exposing (..)

import Json.Decode as Decode exposing (Decoder)
import Json.Encode as Encode exposing (Value)
import Test


type alias Name =
    String


encode : Name -> ( String, Value )
encode name =
    ( "name", Encode.string name )


decoder : Decoder Name
decoder =
    Decode.field "name" Decode.string


compareEncoding : Value -> Name -> Bool
compareEncoding value name =
    Encode.object [ encode name ] == value
