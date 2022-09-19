module Api.Api exposing (..)

import Api.Decoder
import Array
import Date exposing (Date)
import Field.Confidence as Confidence exposing (Confidence)
import Field.Email as Email
import Field.Name as Name
import Http
import Json.Decode as Decode exposing (Decoder, Value, decodeString, field, string)
import Json.Encode as Encode
import User.Member as Member exposing (Member)
import User.MemberBet as MemberBet exposing (MemberBet)
import User.Passcode as Passcode exposing (Passcode)
import Valid.Certified as Certified exposing (Certificate(..), Certified(..), CertifiedEmail, CertifiedName)
import Valid.Valid as Valid exposing (Valid)


type ApiResponse success
    = Success success
    | Failure (List String)
    | ApiError String (List String)
    | ResponseError String (List String)


type GuestSubmitResponse
    = NormalResponse (ApiResponse Member)
    | InviteIssue String


submitBetGuest :
    (Result Http.Error GuestSubmitResponse -> msg)
    ->
        { invite : String
        , guest :
            { name : Valid String
            , email : Valid String
            , confidence : Valid Confidence
            , date : Valid Date
            }
        }
    -> Cmd msg
submitBetGuest toMsg param =
    let
        method =
            "REGISTER_NEW_BET"

        guest =
            param.guest

        bet =
            { confidence = Valid.object guest.confidence
            , date = Valid.object guest.date
            }

        body =
            Encode.object
                [ ( "invite", Encode.string param.invite )
                , Name.encode (Valid.object guest.name)
                , Email.encode (Valid.object guest.email)
                , MemberBet.encode bet
                ]
    in
    Http.request
        { method = method
        , headers = []
        , url = "./php/api.php"
        , body = Http.jsonBody body
        , expect = Http.expectJson toMsg (guestSubmitResponseDecoder method)
        , timeout = Just 5000
        , tracker = Nothing
        }



-- Login


login : (Result Http.Error (ApiResponse Member) -> msg) -> Passcode -> Cmd msg
login toMsg passcode =
    let
        method =
            "LOGIN"

        body =
            Encode.object [ Passcode.encode passcode ]
    in
    Http.request
        { method = method
        , headers = []
        , url = "./php/api.php"
        , body = Http.jsonBody body
        , expect = Http.expectJson toMsg (memberResponseDecoder method)
        , timeout = Just 5000
        , tracker = Nothing
        }



-- SubmitBetMember


submitBetMember :
    (Result Http.Error (ApiResponse Member) -> msg)
    -> { passcode : Passcode, confidence : Valid Confidence, date : Valid Date }
    -> Cmd msg
submitBetMember toMsg param =
    let
        method =
            "UPDATE_BET"

        bet =
            { confidence = Valid.object param.confidence
            , date = Valid.object param.date
            }

        body =
            Encode.object
                [ Passcode.encode param.passcode
                , MemberBet.encode bet
                ]
    in
    Http.request
        { method = method
        , headers = []
        , url = "./php/api.php"
        , body = Http.jsonBody body
        , expect = Http.expectJson toMsg (memberResponseDecoder method)
        , timeout = Just 5000
        , tracker = Nothing
        }



-- SubmitBetGuest
-- checkName


checkName :
    (Result ExtendedError (Certified String) -> msg)
    -> String
    -> Cmd msg
checkName toMsg name =
    let
        method =
            "VERIFY_NAME"

        body =
            Encode.object
                [ Name.encode name ]
    in
    Http.request
        { method = method
        , headers = []
        , url = "./php/api.php"
        , body = Http.jsonBody body
        , expect =
            expectJsonExtended
                { method = method, bodySent = body }
                toMsg
                (Certified.decoder name)
        , timeout = Nothing
        , tracker = Nothing
        }


checkEmail :
    (Result ExtendedError (Certified String) -> msg)
    -> String
    -> Cmd msg
checkEmail toMsg email =
    let
        method =
            "VERIFY_EMAIL"

        body =
            Encode.object
                [ Email.encode email ]
    in
    Http.request
        { method = method
        , headers = []
        , url = "./php/api.php"
        , body = Http.jsonBody body
        , expect =
            expectJsonExtended
                { method = method, bodySent = body }
                toMsg
                (Certified.decoder email)
        , timeout = Nothing
        , tracker = Nothing
        }



-- checkEmail
{-
   checkEmail :
       (Result Http.Error CertifiedEmail -> msg)
       -> String
       -> ( CertifiedEmail, Cmd msg )
   checkEmail toMsg email =
       let
           method =
               "VERIFY_EMAIL"

           body =
               Encode.object
                   [ ( "email", Encode.string email ) ]
       in
       ( Certified email Checking
       , Http.request
           { method = method
           , headers = []
           , url = "./php/api.php"
           , body = Http.jsonBody body
           , expect = Http.expectJson toMsg (Certified.decoder method email)
           , timeout = Nothing
           , tracker = Nothing
           }
       )
-}
-- Helper


memberResponseDecoder : String -> Decoder (ApiResponse Member)
memberResponseDecoder method =
    let
        toResult : String -> Maybe Member -> List String -> List String -> ApiResponse Member
        toResult status maybeMember issues errors =
            case status of
                "ok" ->
                    case maybeMember of
                        Just member ->
                            Success member

                        Nothing ->
                            ResponseError method [ "Problem with Json: status " ++ status ++ " but no member-attribute" ]

                "nok" ->
                    Failure issues

                "error" ->
                    ApiError method errors

                _ ->
                    ResponseError method [ "I got an unexpected response from the server. The procedure " ++ method ++ " did sent the unknown status " ++ status ++ "." ]
    in
    Decode.map4
        toResult
        Api.Decoder.decodeStatus
        (Decode.maybe Member.decode)
        Api.Decoder.decodeIssues
        Api.Decoder.decodeErrors


guestSubmitResponseDecoder : String -> Decoder GuestSubmitResponse
guestSubmitResponseDecoder method =
    let
        toResult : String -> Maybe Member -> List String -> List String -> GuestSubmitResponse
        toResult status maybeMember issues errors =
            case status of
                "ok" ->
                    case maybeMember of
                        Just member ->
                            Success member
                                |> NormalResponse

                        Nothing ->
                            ResponseError method [ "Problem with Json: status " ++ status ++ " but no member-attribute" ]
                                |> NormalResponse

                "inviteIssue" ->
                    InviteIssue (String.join ", " issues)

                "nok" ->
                    Failure issues
                        |> NormalResponse

                "error" ->
                    ApiError method errors
                        |> NormalResponse

                _ ->
                    ResponseError method [ "I got an unexpected response from the server. The procedure " ++ method ++ " did sent the unknown status " ++ status ++ "." ]
                        |> NormalResponse
    in
    Decode.map4
        toResult
        Api.Decoder.decodeStatus
        (Decode.maybe Member.decode)
        Api.Decoder.decodeIssues
        Api.Decoder.decodeErrors


errorToString : Http.Error -> String
errorToString error =
    case error of
        Http.BadUrl url ->
            "BadUrl: " ++ url

        Http.Timeout ->
            "Timeout"

        Http.NetworkError ->
            "NetworkError"

        Http.BadStatus status ->
            "Badstatus: " ++ String.fromInt status

        Http.BadBody response ->
            "BadBody: " ++ response



-- Extended


type alias ExtendedError =
    { method : String
    , bodySent : Value
    , error : Http.Error
    }


expectJsonExtended :
    { method : String, bodySent : Value }
    -> (Result ExtendedError a -> msg)
    -> Decoder a
    -> Http.Expect msg
expectJsonExtended info toMsg decoder =
    let
        extend : Http.Error -> ExtendedError
        extend error =
            { method = info.method, bodySent = info.bodySent, error = error }
    in
    Http.expectStringResponse toMsg <|
        \response ->
            case response of
                Http.BadUrl_ url ->
                    Err <| extend (Http.BadUrl url)

                Http.Timeout_ ->
                    Err <| extend Http.Timeout

                Http.NetworkError_ ->
                    Err <| extend Http.NetworkError

                Http.BadStatus_ metadata body ->
                    Err <| extend (Http.BadStatus metadata.statusCode)

                Http.GoodStatus_ metadata body ->
                    case Decode.decodeString decoder body of
                        Ok value ->
                            Ok value

                        Err err ->
                            Err <| extend (Http.BadBody (Decode.errorToString err))
