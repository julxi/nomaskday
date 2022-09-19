module Field.Field exposing (..)

{-
   type Field
       = NameField
       | EmailField
       | ConfidenceField
       | DateField
-}
--


type Any
    = Guest Guest
    | Bet Bet
    | Invite


type Guest
    = Name
    | Email


type Bet
    = Confidence
    | Date
