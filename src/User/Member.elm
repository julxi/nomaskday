module User.Member exposing (..)

import Field.Confidence exposing (Confidence)
import Field.Date exposing (Date)
import Field.Name exposing (Name)
import Json.Decode as Decode exposing (Decoder)
import Json.Encode as Encode exposing (Value)
import Url exposing (Url)
import Url.Parser
import Url.Parser.Query
import User.MemberBet as MemberBet exposing (MemberBet)
import User.Passcode as Passcode exposing (Passcode(..))


type alias Member =
    { passcode : Passcode
    , name : Name
    , bet : MemberBet
    , isWagerPayed : Bool
    }


testMember =
    { passcode = Passcode "bla"
    , name = "Julian"
    , bet =
        { confidence = Field.Confidence.default
        , date = Field.Date.fromCalendarDate 2022 5 15
        }
    , isWagerPayed = False
    }


getBet : Member -> MemberBet
getBet { passcode, name, bet } =
    bet


getName : Member -> String
getName { passcode, name, bet } =
    name


getPasscode : Member -> Passcode
getPasscode details =
    details.passcode


passcodeAsString : Member -> String
passcodeAsString details =
    Passcode.toString details.passcode


passcodeAsLink : Member -> String
passcodeAsLink details =
    Passcode.toLink details.passcode


decode : Decoder Member
decode =
    let
        constructor : Passcode -> String -> MemberBet -> Bool -> Member
        constructor =
            Member
    in
    Decode.field "member"
        (Decode.map4
            constructor
            Passcode.decode
            (Decode.field "name" Decode.string)
            MemberBet.decode
            (Decode.field "isWagerPayed" Decode.bool)
        )


updateBet : MemberBet -> Member -> Member
updateBet bet member =
    { member | bet = bet }
