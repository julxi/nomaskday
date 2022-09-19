module User.Guest exposing (..)

import Api.Api as Api
import Field.Email
import Field.Field as Field
import Field.Name
import Http
import Json.Encode as Encode
import Url exposing (Url)
import Url.Parser
import Url.Parser.Query
import Valid.Certified as Certified exposing (Certificate(..), Certified(..), CertifiedEmail, CertifiedInvite, CertifiedName)


type Guest
    = Guest
        { name : CertifiedName
        , email : CertifiedEmail
        , invite : Invite
        }


type Invite
    = NoInvite
    | PossiblyInvite String
    | FailedInvite String String


testGuest =
    Guest
        { name = Certified "Julian" Good
        , email = Certified "Julx@web.de" Good
        , invite = PossiblyInvite ""
        }


init : Guest
init =
    Guest
        { name = Certified.uncertified ""
        , email = Certified.uncertified ""
        , invite = NoInvite
        }


initFromUrl : Url -> Guest
initFromUrl url =
    let
        normalizedUrl =
            { url | path = "" }
    in
    case Url.Parser.parse (Url.Parser.query (Url.Parser.Query.string "invite")) normalizedUrl of
        Just (Just invite) ->
            init |> updateInvite invite

        _ ->
            init


getInvite : Guest -> Maybe String
getInvite (Guest details) =
    case details.invite of
        NoInvite ->
            Nothing

        PossiblyInvite invite ->
            Just invite

        FailedInvite invite _ ->
            Just invite


getFullInvite : Guest -> Invite
getFullInvite (Guest details) =
    details.invite


updateInvite : String -> Guest -> Guest
updateInvite newInvite (Guest details) =
    case newInvite of
        "" ->
            Guest { details | invite = NoInvite }

        str ->
            Guest { details | invite = PossiblyInvite str }


badInvite : String -> Guest -> Guest
badInvite issue (Guest details) =
    case getInvite (Guest details) of
        Just invite ->
            Guest { details | invite = FailedInvite invite issue }

        Nothing ->
            Guest details


getName : Guest -> String
getName (Guest details) =
    Certified.getObject details.name


getCertifiedName : Guest -> CertifiedName
getCertifiedName (Guest details) =
    details.name


getCertifiedEmail : Guest -> CertifiedName
getCertifiedEmail (Guest details) =
    details.email


getEmail : Guest -> String
getEmail (Guest details) =
    Certified.getObject details.email


getNameCertificate : Guest -> Certificate
getNameCertificate (Guest details) =
    Certified.getCertificate details.name


getEmailCertificate : Guest -> Certificate
getEmailCertificate (Guest details) =
    Certified.getCertificate details.email


setCertifiedName : CertifiedName -> Guest -> Guest
setCertifiedName name (Guest details) =
    Guest { details | name = name }


setCertifiedEmail : CertifiedEmail -> Guest -> Guest
setCertifiedEmail email (Guest details) =
    Guest { details | email = email }


setField : Field.Guest -> String -> Guest -> Guest
setField field input guest =
    case field of
        Field.Name ->
            setName input guest

        Field.Email ->
            setEmail input guest


setName : String -> Guest -> Guest
setName name guest =
    setCertifiedName (Certified.uncertified name) guest


setEmail : String -> Guest -> Guest
setEmail email guest =
    setCertifiedEmail (Certified.uncertified email) guest


updateNameCertificate : CertifiedName -> Guest -> Guest
updateNameCertificate name (Guest details) =
    Guest { details | name = Certified.replace details.name name }


updateEmailCertificate : CertifiedEmail -> Guest -> Guest
updateEmailCertificate email (Guest details) =
    Guest { details | email = Certified.replace details.email email }


processCertificateResponse : Field.Guest -> Result Api.ExtendedError (Certified String) -> Guest -> Guest
processCertificateResponse field response guest =
    let
        f =
            case field of
                Field.Name ->
                    { getField = getName
                    , setCertified = setCertifiedName
                    , compareEncoding = Field.Name.compareEncoding
                    , raiseError = errorInNameCertificate
                    }

                Field.Email ->
                    { getField = getEmail
                    , setCertified = setCertifiedEmail
                    , compareEncoding = Field.Email.compareEncoding
                    , raiseError = errorInEmailCertificate
                    }
    in
    case response of
        Ok certified ->
            case Certified.getObject certified == f.getField guest of
                True ->
                    f.setCertified certified guest

                False ->
                    guest

        Err { method, bodySent, error } ->
            case f.compareEncoding bodySent (f.getField guest) of
                True ->
                    case error of
                        Http.NetworkError ->
                            f.raiseError
                                [ "It seems like you don't have a stable internet connection. Maybe it helps if you submit it again?" ]
                                guest

                        Http.BadStatus 400 ->
                            f.raiseError [ "I got a badstatus 400. This means... it could be anything. If you see this, you should contact me 😅" ]
                                guest

                        _ ->
                            f.raiseError
                                [ "Problem with"
                                , method
                                , "Body send"
                                , Encode.encode 4 bodySent
                                , "Http.Error"
                                , Api.errorToString error
                                ]
                                guest

                False ->
                    guest


waitForNameVerification : Guest -> Guest
waitForNameVerification (Guest details) =
    Guest { details | name = Certified.checking details.name }


waitForEmailVerification : Guest -> Guest
waitForEmailVerification (Guest details) =
    Guest { details | email = Certified.checking details.email }


errorInNameCertificate : List String -> Guest -> Guest
errorInNameCertificate errors (Guest details) =
    Guest { details | name = Certified.error errors details.name }


errorInEmailCertificate : List String -> Guest -> Guest
errorInEmailCertificate errors (Guest details) =
    Guest { details | email = Certified.error errors details.email }
