module Main exposing (..)

import Browser exposing (Document, application)
import Element
import Logic.Logic as Logic exposing (..)
import Logic.Page as Page exposing (..)
import Page.AccuracyFunction
import Page.Bet
import Page.CheckInvitation
import Page.ConfirmationSubmitGuest
import Page.ContactInfo
import Page.Home
import Page.HowToBet
import Page.Loading
import Page.NotFound
import Page.RemarksAndDetailedExplanations
import Page.WhatIsNoMaskDay


view : Model -> Document Msg
view model =
    let
        title =
            "No-Mask-Day bet"

        currentView =
            case model.page of
                NotFound ->
                    Page.NotFound.view model

                Loading ->
                    Page.Loading.view model

                Home ->
                    Page.Home.view model

                WhatIsNoMaskDay ->
                    Page.WhatIsNoMaskDay.view model

                HowToBet ->
                    Page.HowToBet.view model

                AccuracyFunction ->
                    Page.AccuracyFunction.view model

                ContactInfo ->
                    Page.ContactInfo.view model

                Bet ->
                    Page.Bet.view model

                ConfirmationSubmitGuest ->
                    --todo
                    Page.ConfirmationSubmitGuest.view model

                ConfirmationSubmitMember ->
                    --todo
                    Page.Home.view model

                CheckInvitation ->
                    Page.CheckInvitation.view model

                RemarksAndDetailedExplanations ->
                    Page.RemarksAndDetailedExplanations.view model
    in
    { title = title
    , body =
        [ Element.layoutWith
            { options =
                [ Element.focusStyle
                    { borderColor = Nothing
                    , backgroundColor = Nothing
                    , shadow = Nothing
                    }
                ]
            }
            []
            currentView
        ]
    }


main =
    application
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        , onUrlRequest = onUrlRequest
        , onUrlChange = onUrlChange
        }
