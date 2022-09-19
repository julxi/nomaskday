module Valid.Valid exposing (Valid, fromAutoChecking, fromCertified, object)

import Valid.AutoCheck as AutoCheck exposing (AutoChecking)
import Valid.Certified as Certified exposing (Certificate(..), Certified(..))


type Valid obj
    = Valid obj


object : Valid obj -> obj
object (Valid obj) =
    obj


fromCertified : Certified obj -> Maybe (Valid obj)
fromCertified (Certified obj certificate) =
    case certificate of
        Good ->
            Just (Valid obj)

        _ ->
            Nothing


fromAutoChecking : AutoChecking obj -> Maybe (Valid obj)
fromAutoChecking auto =
    Maybe.map Valid (AutoCheck.publicObject auto)
