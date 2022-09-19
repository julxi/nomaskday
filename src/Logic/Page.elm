module Logic.Page exposing (..)


type Page
    = NotFound
    | Loading
    | Home
    | WhatIsNoMaskDay
    | HowToBet
    | RemarksAndDetailedExplanations
    | AccuracyFunction
    | ContactInfo
    | Bet
    | ConfirmationSubmitGuest
    | ConfirmationSubmitMember
    | CheckInvitation


toPath : Page -> String
toPath page =
    let
        noPath =
            "404"
    in
    case page of
        NotFound ->
            noPath

        Loading ->
            noPath

        Home ->
            noPath

        WhatIsNoMaskDay ->
            "nmd"

        HowToBet ->
            "how-to-bet"

        RemarksAndDetailedExplanations ->
            "remarks"

        AccuracyFunction ->
            "accuracy"

        ContactInfo ->
            "contact"

        Bet ->
            "bet"

        ConfirmationSubmitGuest ->
            "success"

        ConfirmationSubmitMember ->
            noPath

        CheckInvitation ->
            "invitation"


toLink : Page -> String
toLink page =
    "/" ++ toPath page
