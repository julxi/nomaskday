module User.User exposing (..)

import User.Guest exposing (Guest)
import User.Member exposing (Member)
import Valid.Certified exposing (..)


type User
    = NewUser Guest
    | OldUser Member


testGuest =
    NewUser User.Guest.testGuest
