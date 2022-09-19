module User.MemberBet exposing (..)

import Field.Confidence as Confidence exposing (Confidence)
import Field.Date as Date exposing (Date)
import Json.Decode as Decode exposing (Decoder)
import Json.Encode as Encode exposing (Value)


type alias MemberBet =
    { confidence : Confidence
    , date : Date
    }


encode : MemberBet -> ( String, Value )
encode bet =
    ( "bet"
    , Encode.object
        [ Confidence.encode bet.confidence
        , Date.encode bet.date
        ]
    )


decode : Decoder MemberBet
decode =
    Decode.field "bet"
        (Decode.map2
            MemberBet
            Confidence.decode
            Date.decode
        )
