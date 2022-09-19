module Valid.Certified exposing (..)

import Api.Decoder
import Json.Decode as Decode exposing (Decoder)


type alias CertifiedName =
    Certified String


type alias CertifiedEmail =
    Certified String


type alias CertifiedInvite =
    Certified String


type Certified object
    = Certified object Certificate


type Certificate
    = Unknown
    | Checking
    | Good
    | Bad (List String)
    | Error (List String)


uncertified : object -> Certified object
uncertified object =
    Certified object Unknown


checking : Certified object -> Certified object
checking (Certified object _) =
    Certified object Checking


revoke : Certified object -> Certified object
revoke (Certified object certificate) =
    Certified object Unknown


error : List String -> Certified object -> Certified object
error errors (Certified object certificate) =
    Certified object (Error errors)


getObject : Certified object -> object
getObject (Certified object certificate) =
    object


getCertificate : Certified object -> Certificate
getCertificate (Certified object certificate) =
    certificate


replace : Certified object -> Certified object -> Certified object
replace oldCert newCert =
    case getObject oldCert == getObject newCert of
        True ->
            newCert

        False ->
            oldCert


decoder : object -> Decoder (Certified object)
decoder obj =
    let
        transform : String -> List String -> List String -> Certified object
        transform status issues errors =
            case status of
                "ok" ->
                    Certified obj Good

                "nok" ->
                    Certified obj (Bad issues)

                "error" ->
                    Certified obj (Error errors)

                _ ->
                    let
                        errorMessage : String
                        errorMessage =
                            String.join ""
                                [ "Unexpected status \""
                                , status
                                , "\""
                                ]
                    in
                    Certified obj (Error (errorMessage :: errors))
    in
    Decode.map3
        transform
        Api.Decoder.decodeStatus
        Api.Decoder.decodeIssues
        Api.Decoder.decodeErrors
