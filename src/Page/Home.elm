module Page.Home exposing (..)

import Api.Api as Api
import Date as DateExt
import DatePicker.DatePicker as DatePicker
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Font as Font
import Field.Confidence as Confidence
import Field.Date as Date
import Http
import Katex
import Logic.Logic exposing (..)
import Logic.Page as Page exposing (..)
import Ui.CustomElements as CustomEl
import Ui.Palette.Color as Color
import Ui.Palette.Distance as Distance
import Ui.Palette.FontSize as FontSize
import User.Guest as Guest exposing (Guest)
import User.Member as Member exposing (Member)
import User.User exposing (User(..))
import Valid.AutoCheck as AutoCheck
import Valid.Valid as Valid


view : Model -> Element Msg
view model =
    case model.user of
        NewUser guest ->
            pageGuest model guest

        OldUser member ->
            pageMember model member



-- General


zeroEach =
    CustomEl.zeroEach


betColor =
    Color.NeonRed |> Color.translate


notSetColor =
    Color.VeryGray |> Color.translate


linkNoMaskDay linkText =
    CustomEl.link
        CustomEl.colorWhatIsNoMaskDay
        WhatIsNoMaskDay
        linkText


linkLetsBet linkText =
    CustomEl.link
        CustomEl.colorHowToBet
        HowToBet
        linkText


linkToBet model =
    CustomEl.middleSplit
        (CustomEl.formOverview
            (\b ->
                case b of
                    True ->
                        [ Font.alignRight
                        , betColor |> Font.color
                        ]

                    False ->
                        [ Font.alignRight
                        , Font.underline
                        , notSetColor |> Font.color
                        ]
            )
            [ case AutoCheck.publicObject model.date of
                Just date ->
                    ( True, Date.toPrettyString date )

                Nothing ->
                    ( False, "date" )
            , case AutoCheck.publicObject model.confidence of
                Just confidence ->
                    ( True, Confidence.toString confidence ++ "% spread" )

                Nothing ->
                    ( False, "spread" )
            ]
        )
        CustomEl.betBox
        |> CustomEl.pureLink Page.Bet


remarksAndDetailedExplanations =
    el
        [ width shrink
        , Color.NeonOrange |> Color.translate |> Font.color
        , Distance.M |> Distance.translate |> padding
        , 1 |> Border.width
        ]
        (text "R&D")
        |> CustomEl.pureLink RemarksAndDetailedExplanations



-- Guest Stuff


pageGuest : Model -> Guest -> Element Msg
pageGuest model guest =
    [ column
        [ Distance.B |> Distance.translate |> spacing
        ]
        [ textColumn [ width fill ]
            [ paragraph []
                [ text "Corona is still going strong! When can we celebrate the "
                , linkNoMaskDay "No-Mask-Day"
                , text " in Germany?"
                ]
            ]
        , textColumn [ width fill ]
            [ paragraph []
                [ text "Nobody knows! So, "
                , linkLetsBet "let's make a bet"
                ]
            ]
        , textColumn [ width fill ]
            [ paragraph []
                [ text "You can submit and change your bet until "
                , el [ Font.italic ]
                    (startOfBet
                        |> DateExt.add DateExt.Days -1
                        |> Date.toPrettyString
                        |> text
                    )
                ]
            ]
        ]
    , el [ height fill, width fill ]
        (column
            [ width fill
            , Distance.XB |> Distance.translate |> spacing
            , centerY
            ]
            [ column [ width fill ]
                [ CustomEl.middleSplit
                    CustomEl.contactBox
                    (contactInfo model guest)
                    |> CustomEl.pureLink ContactInfo
                , linkToBet model
                ]
            , el [ centerX ] (submitButtonGuest model)
            ]
        )
    , el
        [ alignBottom
        , alignRight
        ]
        remarksAndDetailedExplanations
    ]
        |> CustomEl.homePageLayout (overlay model)


contactInfo model guest =
    let
        colorOk =
            Color.NeonFuschia |> Color.translate

        colorNok =
            Color.VeryGray |> Color.translate
    in
    column
        [ Distance.M |> Distance.translate |> spacing
        , Distance.S |> Distance.translate |> padding
        , centerY
        ]
        [ case guest |> Guest.getCertifiedName |> Valid.fromCertified of
            Just validName ->
                el [ colorOk |> Font.color ] (text (Valid.object validName))

            Nothing ->
                el
                    [ Font.underline
                    , colorNok |> Font.color
                    ]
                    (text "your name")
        , case guest |> Guest.getCertifiedEmail |> Valid.fromCertified of
            Just validEmail ->
                el [ colorOk |> Font.color ] (text (Valid.object validEmail))

            Nothing ->
                el
                    [ Font.underline
                    , colorNok |> Font.color
                    ]
                    (text "your e-mail")
        ]



-- Member Stuff


pageMember : Model -> Member -> Element Msg
pageMember model member =
    [ column
        [ Distance.B |> Distance.translate |> spacing
        ]
        [ textColumn [ width fill ]
            [ paragraph []
                [ text "Hey, "
                , el [ Font.italic ] (text member.name)
                , text " nice to see you again! Here are two reminders of "
                , linkNoMaskDay "No-Mask-Day"
                , text " and "
                , linkLetsBet "How-To-Bet"
                , text "."
                ]
            ]
        , case member.isWagerPayed of
            False ->
                textColumn [ width fill ]
                    [ paragraph []
                        ([ text "You still have to "
                         , el [] (text "pay")
                         , text " your wager of "
                         , el [ Font.bold ] (text "20€")
                         , text " for your bet to be fully completed. You have time till "
                         , startOfBet |> DateExt.add DateExt.Days -1 |> Date.toPrettyString |> text
                         ]
                            ++ (case model.today of
                                    Nothing ->
                                        [ text "."
                                        ]

                                    Just today ->
                                        [ text " - that is, "
                                        , today
                                            |> (\d ->
                                                    DateExt.diff
                                                        DateExt.Days
                                                        d
                                                        startOfBet
                                               )
                                            |> String.fromInt
                                            |> (\x -> el [] (text (x ++ " days")))
                                        , text "."
                                        ]
                               )
                        )
                    ]

            True ->
                none
        , textColumn [ width fill ]
            [ paragraph []
                [ text "You can change your bet as much as you like until "
                , startOfBet
                    |> DateExt.add DateExt.Days -1
                    |> Date.toPrettyString
                    |> text
                , text ". After that you can only watch and wait."
                ]
            ]
        ]
    , el [ height fill, width fill ]
        (column
            [ width fill
            , Distance.XB |> Distance.translate |> spacing
            , centerY
            ]
            [ column [ width fill ]
                [ CustomEl.middleSplit
                    none
                    (el
                        [ FontSize.XXXB
                            |> FontSize.translate
                            |> Font.size
                        , CustomEl.coloredBoxSize |> px |> width
                        , Font.alignRight
                        , Color.NeonRed |> Color.translate |> Font.color
                        ]
                        (text "your")
                    )
                , linkToBet model
                ]
            , el [ centerX ] (submitButtonMember model)
            ]
        )
    , el
        [ alignBottom
        , alignRight
        ]
        remarksAndDetailedExplanations
    ]
        |> CustomEl.homePageLayout (overlay model)


overlay model =
    let
        allMessages =
            problemMessage model
    in
    case allMessages of
        [] ->
            Element.none

        someMessages ->
            CustomEl.messageOverlay someMessages


successMessage model =
    case model.successMessage of
        Just SuccessForNewUser ->
            [ CustomEl.overlayMessage
                (paragraph []
                    [ text "I'm proud of you. You did submit your bet!" ]
                )
                (CustomEl.basicButton AcceptSubmitSuccess Distance.XS Color.NeonPurple "cool :)")
            ]

        Just SuccessForOldUser ->
            [ CustomEl.overlayMessage
                (paragraph []
                    [ text "I'm proud of you. You did update your bet!" ]
                )
                (CustomEl.basicButton AcceptSubmitSuccess Distance.XXS Color.NeonPurple "yeah, I know")
            ]

        Nothing ->
            []


problemMessage model =
    --todo : better error messages
    case model.problem of
        Just problem ->
            [ CustomEl.overlayMessage
                (paragraph []
                    [ case problem of
                        Unspecified error ->
                            column [ Distance.M |> Distance.translate |> spacing ]
                                [ text "Sorry, the server had some issues with your bet. He responded with:"
                                , column []
                                    (List.map text error)
                                , text "maybe you should contact me"
                                ]

                        IssuesInBet issues ->
                            column [ Distance.M |> Distance.translate |> spacing ]
                                [ text "Sorry, servers says your bet is not legit. He's complaining about the following:"
                                , column [ Color.NeonRed |> Color.translate |> Font.color ]
                                    (List.map text issues)
                                , text "Maybe this helps you. If it's just gibberish for you, reach out to me, I'm usually smarter than the server."
                                ]

                        ErrorInLogin description ->
                            column [ Distance.M |> Distance.translate |> spacing ]
                                [ text "Sorry, I encountered an error while trying to log you in:"
                                , column [ Color.NeonRed |> Color.translate |> Font.color ]
                                    (List.map text description)
                                , text "So I couldn't log you in. Try it again or contact me :)"
                                ]

                        HttpError httpError ->
                            case httpError of
                                Http.NetworkError ->
                                    column [ Distance.M |> Distance.translate |> spacing ]
                                        [ text "It seems like your internet connection is gone. Wait till you have internet and submit again."
                                        ]

                                _ ->
                                    column [ Distance.M |> Distance.translate |> spacing ]
                                        [ text "Sorry, I got an Error back from the server. The error reads as:"
                                        , text (Api.errorToString httpError)
                                        , text "you can try to submit your bet again but you can also contact me :)"
                                        ]
                    ]
                )
                (CustomEl.basicButton AcceptSubmitError Distance.M Color.NeonPurple "Ok")
            ]

        Nothing ->
            []


submitButtonGuest : Model -> Element Msg
submitButtonGuest model =
    case ( model.inputControl, validateGuestBet model, model.showSubmitButtonHint ) of
        ( InputNotAllowed, _, _ ) ->
            CustomEl.submitButtonFake
                Color.NeonYellow
                (el [ centerX, centerY ] (text "submitting..."))

        ( _, Just submitData, _ ) ->
            CustomEl.submitButton
                SubmitBetForGuest
                Color.NeonGreen
                (CustomEl.centeredText [] "bid!")

        ( _, _, False ) ->
            CustomEl.submitButton
                (SetSubmitButtonHints True)
                Color.VeryGray
                (CustomEl.centeredText [] "bid")

        ( _, _, True ) ->
            --todo funny submit
            CustomEl.submitButtonFake
                Color.NeonYellow
                (paragraph
                    [ Distance.S |> Distance.translate |> padding
                    , centerX
                    , centerY
                    , FontSize.S |> FontSize.translate |> Font.size
                    , Font.justify
                    ]
                    [ text "You first have to fill out all fields to submit your bet, alright?"
                    , paragraph [ alignRight, Font.alignRight ]
                        [ CustomEl.basicButton (SetSubmitButtonHints False)
                            Distance.XS
                            Color.NeonGreen
                            "alright!"
                        ]
                    ]
                )


submitButtonMember : Model -> Element Msg
submitButtonMember model =
    case ( model.inputControl, validateMemberBet model, model.showSubmitButtonHint ) of
        ( InputNotAllowed, _, _ ) ->
            CustomEl.submitButtonFake
                Color.NeonYellow
                (el [ centerX, centerY ] (text "submitting..."))

        ( _, Just submitData, _ ) ->
            CustomEl.submitButton
                (SubmitBetForMember submitData)
                Color.NeonGreen
                (el [ centerX, centerY ] (text "update!"))

        ( _, _, False ) ->
            CustomEl.submitButton
                (SetSubmitButtonHints True)
                Color.VeryGray
                (paragraph
                    [ FontSize.XXB |> FontSize.translate |> Font.size
                    , Font.alignRight
                    , alignRight
                    ]
                    [ text "is up to date" ]
                )

        ( _, _, True ) ->
            --todo funny submit
            CustomEl.submitButtonFake
                Color.NeonYellow
                (paragraph
                    [ Distance.S |> Distance.translate |> padding
                    , centerX
                    , centerY
                    , FontSize.S |> FontSize.translate |> Font.size
                    , Font.justify
                    ]
                    [ text "What you see is what you bet. Change date or spread to update it."
                    , paragraph [ alignRight, Font.alignRight ]
                        [ CustomEl.basicButton (SetSubmitButtonHints False)
                            Distance.XS
                            Color.NeonGreen
                            "ok!"
                        ]
                    ]
                )
