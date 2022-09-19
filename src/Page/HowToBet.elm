module Page.HowToBet exposing (..)

import Ant.Icon as Icon
import Ant.Icons as Icons
import Date as DateExt
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Font as Font
import Element.Input as Input
import Field.Date as Date
import Katex
import Logic.Logic exposing (..)
import Round
import Ui.CustomElements as CustomEl exposing (zeroEach)
import Ui.Palette.Color as Color
import Ui.Palette.Distance as Distance
import Ui.Palette.FontSize as FontSize
import Widget
import Widget.Material as Material


zeroEach =
    CustomEl.noBorder


paddingList =
    paddingEach { zeroEach | left = Distance.B |> Distance.translate }


view : Model -> Element Msg
view model =
    CustomEl.howToBetPage
        (column []
            [ text "let's make a bet!"
            , el
                [ centerX
                , FontSize.M |> FontSize.translate |> Font.size
                ]
                (text "(in 5 simple steps)")
            ]
        )
        [ placeYourBet model
        , payYourWager model
        , waitTillNmd model
        , receiveYourShare model
        , celebrate model
        ]


placeYourBet : Model -> Element Msg
placeYourBet model =
    column
        [ width fill
        , Distance.XB |> Distance.translate |> spacing
        ]
        [ CustomEl.howToBetStepTitle
            { src = "../images/placeYourBet.svg"
            , description = "caleder with highlighted days"
            }
            "I"
            "place your bet"
        , column [ Distance.M |> Distance.translate |> spacing ]
            [ paragraph []
                [ text "I need the following from you:" ]
            , column
                [ width fill
                , Distance.B
                    |> Distance.translate
                    |> spacing
                , Font.justify
                ]
                [ paragraph []
                    [ el [ alignLeft ]
                        (Icons.idcardOutlined
                            [ Icon.width 50
                            , Color.NeonBlue |> Color.translate |> Icon.fill
                            ]
                        )
                    , text "a "
                    , CustomEl.boldFont "name"
                    , text " by which you want to be known during the bet. It doesn't have to be your real name, be funny or mysterious."
                    ]
                , paragraph []
                    [ el [ alignLeft ]
                        (Icons.mailOutlined
                            [ Icon.width 50
                            , Color.NeonBlue |> Color.translate |> Icon.fill
                            ]
                        )
                    , text "your "
                    , CustomEl.boldFont "email"
                    , text " over which I can reach out to you to keep you up to date. Don't worry, I won't spam you nor will your e-mail be made public."
                    ]
                , textColumn
                    [ width fill ]
                    [ paragraph []
                        [ el [ alignLeft ]
                            (Icons.fundOutlined
                                [ Icon.width 50
                                , Color.NeonBlue |> Color.translate |> Icon.fill
                                ]
                            )
                        , text "your "
                        , CustomEl.boldFont "point distribution"
                        , text ", the actual part of betting. So pay attention, "
                        , el
                            [ Color.NeonYellow
                                |> Color.translate
                                |> Font.color
                            ]
                            (text "this is the most important part!")
                        ]
                    , paragraph []
                        [ text "The idea is that you have 1000 points which you split up among the days in 2022-2024. The more points you bet correctly on the actual date of No-Mask-Day, the more money you win. You can place all your points on one day or spread them out over a couple of days, weeks, months or even distribute them evenly among the "
                        , DateExt.toRataDie endOfBet - DateExt.toRataDie startOfBet + 1 |> String.fromInt |> text
                        , text " eligible days. The last case would mean about 0.91 points per day. So yeah, your points have a floating point."
                        ]
                    ]
                ]
            ]
        ]


payYourWager : Model -> Element Msg
payYourWager model =
    column
        [ width fill
        , Distance.XB |> Distance.translate |> spacing
        ]
        [ CustomEl.howToBetStepTitle
            { src = "../images/payYourWager2.svg"
            , description = "money taking a trip around the world"
            }
            "II"
            "pay your wager"
        , textColumn
            [ Distance.M |> Distance.translate |> spacing
            , width fill
            ]
            [ paragraph []
                [ text "The wager for this bet is" ]
            , paragraph
                [ Font.center
                , FontSize.B |> FontSize.translate |> Font.size
                ]
                [ text "20€" ]
            , paragraph [ Font.justify ]
                [ text "and you have to pay it" ]
            , paragraph
                [ Font.center
                , FontSize.B |> FontSize.translate |> Font.size
                ]
                [ (DateExt.toRataDie startOfBet - 1)
                    |> DateExt.fromRataDie
                    |> Date.toPrettyString
                    |> (\s -> "until " ++ s ++ ".")
                    |> text
                ]
            ]
        , textColumn
            [ width fill, Distance.S |> Distance.translate |> spacing ]
            [ paragraph [ Font.justify ]
                [ text "I collect all the wagers "
                , CustomEl.boldFont "personally¹"
                , text " and put them in a metaphorical pot. Your winnings will be a share from this pot."
                ]
            , paragraph [ FontSize.S |> FontSize.translate |> Font.size ]
                [ text "1: I do this for security reasons. So do not trust any email from @no-mask-day.com about payment issues." ]
            ]
        ]


waitTillNmd : Model -> Element Msg
waitTillNmd model =
    let
        item itemText =
            paragraph
                [ Border.widthEach { zeroEach | left = Distance.XXS |> Distance.translate }
                , Color.NeonBlue |> Color.translate |> Border.color
                , paddingEach { zeroEach | left = Distance.M |> Distance.translate }
                ]
                [ text itemText ]
    in
    column
        [ width fill
        , Distance.XB |> Distance.translate |> spacing
        ]
        [ CustomEl.howToBetStepTitle
            { src = "../images/waitTillNmd.svg"
            , description = "days counted on a wall"
            }
            "III"
            "wait till No-Mask-Day"
        , textColumn
            [ Distance.M |> Distance.translate |> spacing
            , width fill
            ]
            [ paragraph [ Font.justify ]
                [ text "There is not much to do for you after you payed your wager. In the next year, I will publish all bets on this website, so you can see what others think when the No-Mask-Day might happen." ]
            , paragraph [ Font.justify ]
                [ text "If you get bored while waiting for No-Mask-Day I have a short list of fun activities for you:"
                ]
            , textColumn
                [ width fill
                , paddingEach { zeroEach | left = Distance.B |> Distance.translate }
                , Distance.S |> Distance.translate |> spacing
                ]
                [ item "check the current corona incidence"
                , item "what are the latest corona measures"
                , item "cancel your holiday plans"
                , item "look at the vaccination rate"
                , item "compare Germany to other EU-countries"
                , item "compare Germany to the US"
                , item "check how much you would win/lose if No-Mask-Day where in a month"
                ]
            ]
        ]


receiveYourShare : Model -> Element Msg
receiveYourShare model =
    column
        [ width fill
        , Distance.XB |> Distance.translate |> spacing
        ]
        [ CustomEl.howToBetStepTitle
            { src = "../images/receiveYourShare.svg"
            , description = "a piece of cake"
            }
            "IIII"
            "receive your share"
        , textColumn
            [ Distance.M |> Distance.translate |> spacing
            , width fill
            ]
            [ paragraph [ Font.justify ]
                [ text "When the bet concluded, i.e., No-Mask-Day happened. I will personally contact you again, for giving you your winnings, as a share from the pot. Your share depends on how good you bet in comparison to the other participants. You remember the important part about the points of the first step? We need those now to determine the size of your share. Your share is the wager multiplied by the quotient of your points to the average points. To be more precise, let's say"
                , "p_1,p_2,\\dots p_n" |> CustomEl.mathInline
                , text " are the points of all members ("
                , "n" |> CustomEl.mathInline
                , text " is how many members are in this bet) and your points are "
                , "p_1" |> CustomEl.mathInline
                , text ", then you share is"
                ]
            , paragraph [ Font.center ]
                [ "20€ \\cdot \\frac{p_1}{\\bar{p}}"
                    |> Katex.display
                    |> Katex.print
                    |> text
                ]
            , paragraph [ Font.justify ]
                [ text "where "
                , "\\bar{p} = \\frac{p_1 + \\dots p_n}{n}"
                    |> Katex.inline
                    |> Katex.print
                    |> text
                , text "  is the arithmetic mean of the points."
                ]
            ]
        , column
            [ Distance.M |> Distance.translate |> spacing
            , width fill
            ]
            [ paragraph
                [ Font.bold
                , Color.NeonYellow |> Color.translate |> Font.color
                ]
                [ text "Let's see if you got it:" ]
            , paragraph []
                [ text "Imagine a sad world in which only three people participated in the bet. And in this sad world No-Mask-Day happens on "
                , Date.fromCalendarDate 2024 5 15 |> Date.toPrettyString |> text
                , text ". You three have bet the following amount of points on this date (all were surprised how late the No-Mask-Day happened):"
                ]
            , el [ centerX ]
                (Element.table
                    [ centerX
                    , Distance.S
                        |> Distance.translate
                        |> spacing
                    ]
                    { data = shareExample
                    , columns =
                        [ { header = el [ Font.bold ] (Element.text "Participant")
                          , width = 100 |> px
                          , view =
                                \( name, _ ) ->
                                    Element.text name
                          }
                        , { header = el [ Font.bold ] (Element.text "Points")
                          , width = 100 |> px
                          , view =
                                \( _, points ) ->
                                    Element.text (String.fromFloat points)
                          }
                        ]
                    }
                )
            , paragraph
                [ Color.NeonYellow |> Color.translate |> Font.color
                , width shrink
                , centerX
                ]
                [ text "How big is your share in this case?" ]
            , el [ centerX ]
                (Input.radioRow
                    ([ spacing 20
                     , centerX
                     ]
                        ++ quizHint model
                    )
                    { onChange = AnswerLittleQuiz
                    , selected = model.littleQuiz
                    , label = Input.labelHidden "Which is the correct share?"
                    , options =
                        [ Input.option False1
                            (shareExample
                                |> quizAnswer False1
                                |> (\x -> x ++ "€")
                                |> text
                            )
                        , Input.option False2
                            (shareExample
                                |> quizAnswer False2
                                |> (\x -> x ++ "€")
                                |> text
                            )
                        , Input.option False3
                            (shareExample
                                |> quizAnswer False3
                                |> (\x -> x ++ "€")
                                |> text
                            )
                        , Input.option Correct
                            (shareExample
                                |> quizAnswer Correct
                                |> (\x -> x ++ "€")
                                |> text
                            )
                        ]
                    }
                )
            ]
        ]


quizHint : Model -> List (Attribute Msg)
quizHint model =
    let
        greenFont =
            Color.NeonGreen |> Color.translate |> Font.color

        redFont =
            Color.NeonRed |> Color.translate |> Font.color

        avgPointsText =
            shareExample |> justPoints |> avgPoints |> Round.round 2

        yourPointsText =
            shareExample |> justPoints |> yourPoints |> Round.round 2

        yourShareText =
            shareExample |> justPoints |> yourShare |> Round.round 0
    in
    case model.littleQuiz of
        Just answer ->
            let
                hint =
                    case ( answer, model.littleQuizTries ) of
                        ( _, Nothing ) ->
                            []

                        ( Correct, _ ) ->
                            [ paragraph []
                                [ text "Just to reiterate: The average is "
                                , shareExample |> justPoints |> avgPoints |> Round.round 2 |> text
                                , text " which gives you a share of "
                                , "20€ \\cdot \\frac{"
                                    ++ yourPointsText
                                    ++ "}{"
                                    ++ avgPointsText
                                    ++ "} = "
                                    ++ yourShareText
                                    ++ "€"
                                    |> Katex.inline
                                    |> Katex.print
                                    |> text
                                ]
                            ]

                        ( False1, _ ) ->
                            --avg * 20
                            [ paragraph []
                                [ text "Calculating the average is the first part for determining your share. Then have to divide "
                                , "20€ · "
                                    ++ yourPointsText
                                    |> text
                                , text " by it."
                                ]
                            ]

                        ( False2, _ ) ->
                            [ paragraph []
                                [ text "It's not just the points that define your share, but it's relation to the average. Also the average points is "
                                , shareExample
                                    |> justPoints
                                    |> List.map (Round.round 1)
                                    |> String.join " + "
                                    |> (\x ->
                                            "("
                                                ++ x
                                                ++ ") / 3"
                                       )
                                    |> text
                                ]
                            ]

                        ( False3, _ ) ->
                            -- score
                            [ paragraph [] [ text "That share is a bit small. Did you maybe forget to multiply by 20?" ] ]

                teaser =
                    (case ( answer, model.littleQuizTries ) of
                        ( Correct, Nothing ) ->
                            [ el [ greenFont ] (text "Right!") ]

                        ( _, Nothing ) ->
                            [ el [ redFont ] (text "False!") ]

                        ( Correct, Just 0 ) ->
                            [ text "Yeah, "
                            , el [ greenFont ] (text "right!")
                            ]

                        ( Correct, Just 1 ) ->
                            [ text "Now you got it, "
                            , el [ greenFont ] (text "right")
                            , text " !"
                            ]

                        ( Correct, Just 2 ) ->
                            [ el [ greenFont ] (text "Right")
                            , text ", exactly! And you see why now?"
                            ]

                        ( Correct, Just 3 ) ->
                            [ text "Yes, it's "
                            , el [ greenFont ] (text "right")
                            , text "! You get a star for not giving up ;)"
                            ]

                        ( Correct, Just 4 ) ->
                            [ el [ greenFont ] (text "Yes!")
                            , text " It's not the othe 3 wrong answers!"
                            ]

                        ( Correct, _ ) ->
                            [ text "Finally, "
                            , el [ greenFont ] (text "yes!")
                            , text " I already lost all hope."
                            ]

                        ( _, Just 1 ) ->
                            [ text "That's "
                            , el [ redFont ] (text "false")
                            , text ". But no biggie. Maybe I can give you a hint:"
                            ]

                        ( _, _ ) ->
                            [ text "That's still "
                            , el [ redFont ] (text "not correct")
                            , text ", sorry."
                            ]
                    )
                        |> (\ele -> [ paragraph [] ele ])
            in
            [ textColumn
                [ width fill
                , Color.Black
                    |> Color.translate
                    |> Background.color
                , Distance.XS
                    |> Distance.translate
                    |> spacing
                , Distance.M
                    |> Distance.translate
                    |> toFloat
                    |> moveDown
                , Distance.S
                    |> Distance.translate
                    |> padding
                , 1 |> Border.width
                ]
                (teaser ++ hint)
                |> below
            ]

        Nothing ->
            []


quizAnswer : LittleQuiz -> List ( String, Float ) -> String
quizAnswer answer example =
    let
        fun =
            case answer of
                False1 ->
                    avgPoints >> (*) 20 >> Round.round 0

                False2 ->
                    yourPoints
                        >> (*) 20
                        >> Round.round 0

                False3 ->
                    yourScore >> Round.round 2

                Correct ->
                    yourShare >> Round.round 0
    in
    example |> justPoints |> fun


shareExample : List ( String, Float )
shareExample =
    [ ( "you", 0.6 )
    , ( "Gandalf", 0.8 )
    , ( "Fblthp", 0.1 )
    ]


justPoints : List ( String, Float ) -> List Float
justPoints points =
    List.map (\( x, y ) -> y) points


yourPoints : List Float -> Float
yourPoints points =
    case List.head points of
        Just point ->
            point

        Nothing ->
            0


avgPoints : List Float -> Float
avgPoints points =
    List.sum points / toFloat (List.length points)


yourScore : List Float -> Float
yourScore points =
    yourPoints points / avgPoints points


yourShare : List Float -> Float
yourShare points =
    20 * yourScore points


celebrate : Model -> Element Msg
celebrate model =
    column
        [ width fill
        , Distance.XB |> Distance.translate |> spacing
        ]
        [ row
            [ width fill
            ]
            [ image
                [ fill |> maximum 200 |> width
                ]
                { src = "../images/celebrate.svg"
                , description = "a crazy party"
                }
            , column
                [ alignRight
                , FontSize.XXXB
                    |> FontSize.translate
                    |> Font.size
                , fill |> maximum 200 |> width
                , height fill
                ]
                [ paragraph
                    [ alignTop
                    , Font.center
                    , Font.family [ Font.serif ]
                    ]
                    [ text "V" ]
                , paragraph
                    [ centerY
                    , Font.center
                    ]
                    [ text "celebrate!" ]
                ]
            ]
        , image
            [ fill |> width
            ]
            { src = "../images/party.webp"
            , description = "I hate copyright so much!"
            }
        ]
