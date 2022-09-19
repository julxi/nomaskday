module Page.RemarksAndDetailedExplanations exposing (..)

import Date as DateExt
import Element exposing (..)
import Element.Border as Border
import Element.Font as Font
import Logic.Logic exposing (..)
import Ui.CustomElements as CustomEl exposing (mathDisplay, mathInline)
import Ui.Palette.Color as Color
import Ui.Palette.Distance as Distance
import Ui.Palette.FontSize as FontSize


zeroEach =
    CustomEl.zeroEach


title txt msg plusMinus =
    let
        color =
            case plusMinus of
                True ->
                    CustomEl.rndColor

                False ->
                    Color.VeryGray
    in
    row [ width fill ]
        [ paragraph
            [ FontSize.B
                |> FontSize.translate
                |> Font.size
            , Font.bold
            ]
            [ text txt ]
        , el
            [ 30 |> px |> width
            , centerY
            ]
            (CustomEl.plusMinusButton msg plusMinus 20 color)
        ]


section model titleTxt content =
    let
        isVisible =
            isVisibleRnDSection titleTxt model
    in
    column
        [ width fill
        , Distance.B |> Distance.translate |> spacing
        ]
        ([ title
            titleTxt
            (SetVisibilityRnDSection titleTxt (not isVisible))
            (not isVisible)
         ]
            ++ (case isVisible of
                    True ->
                        [ content ]

                    False ->
                        []
               )
        )


view : Model -> Element Msg
view model =
    CustomEl.explanationPage CustomEl.rndColor
        [ el
            [ Font.bold
            , CustomEl.rndColor |> Color.translate |> Font.color
            ]
            (text "remarks and detailed explanations")
        , section model
            "where did the idea come from?"
            (textColumn
                [ fill |> width
                , Distance.S |> Distance.translate |> spacing
                ]
                [ paragraph []
                    [ text "The initial idea for betting on No-Mask-Day came to me on a lazy Sunday morning, as some kind of joyful anticipation of some normality again. Some days later I also had the great stupid idea to expand this bet to all my friends, family, and people I want to get in contact with again. And that I need some kind of automated betting system for that - I was also partly motivated by the need for a programming project for "
                    , CustomEl.externalLink Color.NeonPurple "https://elm-lang.org/" "ELM"
                    , text ", a programming language I feel worth of further exploring and learning. "
                    ]
                , paragraph []
                    [ text " I started coding (slowely) in spring 2021 and now many months later I am finally finsihed (kind of). I had to put in much more time and effort than I had anticipated. But isn't that normal for projects??"
                    ]
                ]
            )
        , section model
            "this is a private fun project!"
            (textColumn
                [ fill |> width
                , Distance.S |> Distance.translate |> spacing
                ]
                [ paragraph []
                    [ text "So don't take it too seriously. \"Fun\" means that I don't want you to feel presured by no means to participate in this bet. If you feel uncomfortable, don't worry it's fine to stay out it. Or, if you are unsure, you can also ask me directly wether this is some shady scam I am trying to pull of. " ]
                , paragraph [] [ text "\"Fun\" also means that this is not really about money. I hope you can easily spent 20€ and it doesn't really hurt you in case you loose all of it (not that you will. You will win big!)." ]
                , paragraph [] [ text "I put \"private\" for legal reasons. Only people who received a personalized invitation code can participate. I know everybody who is participating in this bet and I don't have any financial benefit from it (except if I win of course). So if I understood the German law correctly I don't have to provide an \"Impressum\" or follow any regulations of the \"Glücksspielgesetz\" (please don't sue me ^^)" ]
                ]
            )
        , section model
            "what happens to the bet if No-Mask-Day does not happen within the next 3 years?"
            (textColumn [ fill |> width ]
                [ paragraph []
                    [ text "Uff, please not! Well, shit, in that case the bet is over, no celebration, no happiness. You get your wager back and that's it. What about interest rates or whatever? ...pfff... I don't know, it's just 20€..." ]
                , paragraph [] [ text "Let's just pretend that this can not happen :)" ]
                ]
            )
        , section model
            "what happens with the collected money (the pot) until No-Mask-Day?"
            (textColumn [ fill |> width ]
                [ paragraph []
                    [ text "It might happen that I collect quite an amount of money. Let's say 50 poeple actually participate (that would be so awesome btw), then I have 1000€ sitting on my bank account. If it comes to that, I might want do find a small project for the money. Like an ethical ETF or something. The surplus of that could go to some charity, and I would cover any potential deficites. But I don't promise anything at the moment except than that you will receive your share at the end of the bet." ]
                ]
            )
        , section model
            "how is the points distribution computed?"
            (textColumn
                [ fill |> width
                , Distance.S |> Distance.translate |> spacing
                ]
                [ paragraph []
                    [ text "Good question! But actuall you don't need to understand the exact formula. You can just look at the graph that shows up while you place your bet. What you see is what you get! " ]
                , paragraph []
                    [ text "I think the basic idea is quite simple: it's a bell-shaped curve around your chosen date which gets wider and smaller the greater you set the spread-parameter. But if you really want to know the details, here they come:" ]
                , paragraph []
                    [ text "The points distribution, "
                    , CustomEl.mathInline "p(d)"
                    , text ", is a normalized discretisation of a truncated normal distribution on the days "
                    , CustomEl.mathInline "d"
                    , text " from the years 2022-2024 of the form:"
                    ]
                , paragraph
                    [ paddingEach
                        { zeroEach
                            | top = Distance.B |> Distance.translate
                            , bottom = Distance.B |> Distance.translate
                        }
                    ]
                    [ CustomEl.mathDisplay "p(d \\;|\\; D, s) = m \\cdot e^{-\\big(|D - d| \\log(s)\\big)^2}" ]
                , paragraph []
                    [ text "with the parameters "
                    , CustomEl.mathInline "D"
                    , text " (the date on which you bet) "
                    , text " and "
                    , CustomEl.mathInline "s"
                    , text " (a spread-parameter), and a normalising factor "
                    , CustomEl.mathInline "m"
                    , text " such that the sum of "
                    , CustomEl.mathInline "p(d)"
                    , text " is 1000 over all days between 2022-2024. Also "
                    , CustomEl.mathInline "|D-d|"
                    , text " denotes the number of days one has to count from one date to the other on a calender (or you just take the differenc of the respective "
                    , CustomEl.externalLink Color.NeonPurple "https://en.wikipedia.org/wiki/Julian_day" "Julian days"
                    , text " :D )."
                    ]
                , let
                    daysInBet =
                        DateExt.diff DateExt.Days startOfBet endOfBet |> String.fromInt
                  in
                  paragraph []
                    [ text "The point distribution is natrually extended to the extrem cases of "
                    , CustomEl.mathInline "s"
                    , text " as:"
                    , CustomEl.mathDisplay "p(d\\;|\\;D,0) =  \\begin{cases}   1000 &\\text{if } d = D \\\\   0 &\\text{else} \\end{cases}"
                    , text "and "
                    , CustomEl.mathDisplay ("p(d\\;|\\;D,1) =  \\frac{1000}{" ++ daysInBet ++ "}")
                    ]
                , paragraph []
                    [ text "To be fair, the exact form of the points distribution was choosen quite randomly. I just wanted some bell-shaped thingy that converges to the unifrom and one-point distributions in the extremes." ]
                ]
            )
        , section model
            "remarks about the bet."
            (textColumn
                [ fill |> width
                , Distance.M |> Distance.translate |> spacing
                ]
                [ paragraph []
                    [ text "There are some general insights I want to share with you. So you can bet more informed :)"
                    ]
                , paragraph []
                    [ el [ CustomEl.rndColor |> Color.translate |> Font.color ] (text "First")
                    , text ", let's think a bit more about the final amount of money you get out of this bet. Obviously, if you wager 20€ and later your share is 16€ you have lost 4€ in this bet. To figure out what happens in general we look at the process of the bet a bit more closely. Let's pretend it's already No-Mask-Day and "
                    , mathInline "p_1, p_2, \\dots , p_n"
                    , text " are the points all members of the bet have set on this date and furtherome "
                    , mathInline "p_1"
                    , text " are your points."
                    , text " Then the overal money you win from this bet is"
                    , CustomEl.mathDisplay "20€ \\cdot \\left(\\frac{p_1}{\\bar{p}} - 1\\right)"
                    , text "where "
                    , mathInline "\\bar{p} = \\frac{p_1 + \\dots p_n}{n}"
                    , text " is the average of the points. That's because the quotient "
                    , mathInline "p_1 / \\bar{p}"
                    , text " corresponds to the share you get back and the "
                    , mathInline "-1"
                    , text " to the intial wager you have to pay to take part in the bet. So, you gain money if the term in the bracket is positive and you loose money if its negative, i.e., you win money if your bet was better than the average and you lose money if it was worse."
                    ]
                , paragraph []
                    [ el [ CustomEl.rndColor |> Color.translate |> Font.color ] (text "Second")
                    , text ", let me note that this bet is a zero-sum-bet. That means that the total amount of money over all participants lost/won is 0€. Every Euro you lose goes to another member of this bet and all money you win comes from another member of this bet. So, you could also call this the No-Mask-Day lottery if you wanted to."
                    ]
                , paragraph []
                    [ el [ CustomEl.rndColor |> Color.translate |> Font.color ] (text "Third")
                    , text ", assuming no further information about No-Mask-Day, i.e., if we assume that No-Mask-Day is equally probable for all days in 2022-2024, then all bets have the same average winnig, namely 0€. I also see this as some kind of fairness-criterion."
                    ]
                , paragraph []
                    [ el [ CustomEl.rndColor |> Color.translate |> Font.color ] (text "Fourth.")
                    , text " I have to implement all this stuff on a computer, so we get rounding erros. Maybe some bets sum up to a little more over 1000 or under 1000. However, believe me, these little inaccuracies do not matter. Hmmm... why am I mentioning this then? "
                    ]
                ]
            )
        , section model
            "what happens to your data?"
            (textColumn [ fill |> width ]
                [ paragraph []
                    [ text "I don't collect any unnecessary data from you. Just some account-name and your e-mail. On my server, however, I have a table that links your bet to your real name via the invitation code. I need this so I can know who has payed the wager and who gets how much money back. But this information stays on the server and is not broadcastet publicaly anywhere." ]
                , paragraph
                    []
                    [ text "Your account-name and the details of your bet will be made public on this website eventually. I just think that it is interesting for you to see what others think when the \"end of corona\" will be. Also, and actually more importantly, a public list over all bets ensures a verifyability of the outcome of this bet. Otherwise I could for example just say that I myself miracolously had bet 1000 points exacty on No-Mask-Day, and you couldn't complain because you haven't seen my bet beforehand." ]
                ]
            )
        ]
