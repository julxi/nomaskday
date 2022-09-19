module Logic.Router exposing (..)

import Logic.Page as Page exposing (..)
import Url exposing (..)
import Url.Parser exposing (..)


route : Parser (Page -> a) a
route =
    oneOf
        [ map Home top
        , map WhatIsNoMaskDay (s (Page.toPath WhatIsNoMaskDay))
        , map HowToBet (s (Page.toPath HowToBet))
        , map AccuracyFunction (s (Page.toPath AccuracyFunction))
        , map ContactInfo (s (Page.toPath ContactInfo))
        , map Bet (s (Page.toPath Bet))
        , map ConfirmationSubmitGuest (s (Page.toPath ConfirmationSubmitGuest))
        , map CheckInvitation (s (Page.toPath CheckInvitation))
        , map RemarksAndDetailedExplanations (s (Page.toPath RemarksAndDetailedExplanations))
        ]


toPage : Url -> Page
toPage url =
    Maybe.withDefault NotFound (parse route url)
