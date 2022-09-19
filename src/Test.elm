module Test exposing (..)

import Json.Decode as Decode exposing (Decoder)
import Json.Encode as Encode exposing (Value)


type alias A =
    String


type alias B =
    String


type Product
    = Product A B


type alias Bla =
    { a : A, b : B }


type Union
    = Left A
    | Right B


encodeA : A -> Value
encodeA a =
    Encode.string a


encodeB : B -> Value
encodeB b =
    Encode.string b


encodeBla : Bla -> Value
encodeBla bla =
    Encode.object [ ( "a", encodeA bla.a ), ( "b", encodeB bla.b ) ]
