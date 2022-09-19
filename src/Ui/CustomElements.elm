module Ui.CustomElements exposing (..)

import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Font as Font
import Element.Input as Input
import Html
import Html.Attributes
import Html.Events
import Json.Decode as Decode
import Katex
import Logic.Page as Page exposing (..)
import Logic.Router as Router exposing (..)
import Ui.Palette.Color as Color
import Ui.Palette.Distance as Distance
import Ui.Palette.FontSize as FontSize



-- Basic Colors / Constants


rndColor =
    Color.NeonOrange


betFormColor =
    Color.NeonRed |> Color.translate


coloredBoxSize =
    75


basicPageLayout =
    [ fill |> maximum 600 |> width
    , height fill
    , Color.Black |> Color.translate |> Background.color
    , Color.White |> Color.translate |> Font.color
    , FontSize.M |> FontSize.translate |> Font.size
    , centerX
    ]


myFocused =
    focused [ Color.NeonYellow |> Color.translate |> (\x -> Border.glow x 1) ]



-- General


littlePlus attr size =
    el
        ([ size |> px |> width
         , size |> px |> height
         , 1 |> Border.width
         ]
            ++ attr
        )
        (el [ centerX, centerY ] (text "+"))


boldFont content =
    el [ Font.bold ] (text content)


noBorder =
    { left = 0
    , right = 0
    , top = 0
    , bottom = 0
    }


zeroEach =
    { left = 0
    , right = 0
    , top = 0
    , bottom = 0
    }



--Helpers


centeredText : List (Attribute msg) -> String -> Element msg
centeredText attributes string =
    el ([ centerX, centerY ] ++ attributes) (text string)


mathInline txt =
    txt |> Katex.inline |> Katex.print |> text


mathDisplay txt =
    txt |> Katex.display |> Katex.print |> text



-- Home Elements


homePageLayout : Element msg -> List (Element msg) -> Element msg
homePageLayout overlay content =
    column
        (inFront overlay
            :: basicPageLayout
        )
        [ el
            [ width fill
            , FontSize.XXB |> FontSize.translate |> Font.size
            , Font.bold
            , Color.White |> Color.translate |> Font.color
            , Color.Black |> Color.translate |> Background.color
            , Distance.XB |> Distance.translate |> padding
            , Border.widthEach
                { bottom = 1
                , left = 0
                , right = 0
                , top = 0
                }
            , Color.White |> Color.translate |> Border.color
            ]
            (text "No-Mask-Day bet!")
        , column
            [ width fill
            , height fill
            , Distance.XB |> Distance.translate |> padding
            ]
            content
        ]


messageOverlay : List (Element msg) -> Element msg
messageOverlay messages =
    el
        (basicPageLayout
            ++ [ Background.image
                    "../images/static_noise.png"
               ]
        )
        (el
            [ width fill
            , height fill
            , Color.Black
                |> Color.translateAlpha 0.85
                |> Background.color
            ]
            (column
                [ centerY
                , width fill
                , Distance.XXXXB
                    |> Distance.translate
                    |> spacing
                ]
                messages
            )
        )



--Custom Buttons


plusMinusButton : msg -> Bool -> Int -> Color.Color -> Element msg
plusMinusButton msg isPlus size color =
    let
        plusMinus =
            case isPlus of
                True ->
                    "+"

                False ->
                    "-"
    in
    Input.button
        [ size |> px |> width
        , size |> px |> height
        , toFloat size / 20 |> ceiling |> Border.width
        , color |> Color.translate |> Font.color
        , myFocused
        ]
        { onPress = Just msg
        , label =
            el
                [ centerX
                , centerY
                , size - 2 |> Font.size
                ]
                (text plusMinus)
        }


submitButton : msg -> Color.Color -> Element msg -> Element msg
submitButton msg color label =
    Input.button
        [ 2 * coloredBoxSize |> px |> width
        , coloredBoxSize |> px |> height
        , color |> Color.translate |> Border.color
        , Distance.XXXS |> Distance.translate |> Border.width
        , color |> Color.translate |> Font.color
        , FontSize.B |> FontSize.translate |> Font.size
        , myFocused
        ]
        { onPress = Just msg
        , label = label
        }


submitButtonFake : Color.Color -> Element msg -> Element msg
submitButtonFake color content =
    el
        [ 2 * coloredBoxSize |> px |> width
        , coloredBoxSize |> px |> height
        , color |> Color.translate |> Border.color
        , Distance.XXXS |> Distance.translate |> Border.width
        , color |> Color.translate |> Font.color
        , FontSize.B |> FontSize.translate |> Font.size
        ]
        content


middleSplit : Element msg -> Element msg -> Element msg
middleSplit leftContent rightContent =
    row [ width fill ]
        [ el [ width fill, height fill, clip ] (el [ height fill, alignRight ] leftContent)
        , el [ width fill, height fill, clip ] (el [ height fill, alignLeft ] rightContent)
        ]


formOverview : (Bool -> List (Attribute msg)) -> List ( Bool, String ) -> Element msg
formOverview selectStyle rows =
    let
        makeParagraph ( whichStyle, content ) =
            case whichStyle of
                True ->
                    paragraph (selectStyle True) [ text content ]

                False ->
                    paragraph (selectStyle False) [ text content ]
    in
    textColumn
        [ Distance.M |> Distance.translate |> spacing
        , Distance.S |> Distance.translate |> padding
        , centerY
        , width shrink
        ]
        (List.map makeParagraph rows)


welcomeBox =
    colorBox Color.White
        [ column
            [ FontSize.XB
                |> FontSize.translate
                |> Font.size
            ]
            [ text "Wel", text "come" ]
        ]


overlayMessage : Element msg -> Element msg -> Element msg
overlayMessage message button =
    column
        [ width fill
        , height fill
        , Color.Black |> Color.translate |> Background.color
        , Distance.XXXB
            |> Distance.translate
            |> padding
        , Distance.XB
            |> Distance.translate
            |> spacing
        , Border.widthEach
            { noBorder | top = 1, bottom = 1 }
        ]
        [ message
        , el [ centerX ] button
        ]



-- HowTOBet


howToBetPage : Element msg -> List (Element msg) -> Element msg
howToBetPage title steps =
    let
        color =
            colorHowToBet
    in
    el
        basicPageLayout
        (column
            [ width fill
            ]
            [ el
                [ width fill
                , FontSize.XB |> FontSize.translate |> Font.size
                , Font.bold
                , Color.White |> Color.translate |> Font.color
                , Color.Black |> Color.translate |> Background.color
                , Distance.XB |> Distance.translate |> padding
                , Border.widthEach
                    { zeroEach | bottom = Distance.S |> Distance.translate }
                , Color.NeonBlue |> Color.translate |> Border.color
                ]
                title
            , lineBetweenSteps
                { color = Color.NeonBlue
                , height = 1000 |> px
                , thickness = Distance.S |> Distance.translate |> px
                , contentLeft = none
                }
            , column [ width fill ]
                (List.intersperse
                    (lineBetweenSteps
                        { color = color
                        , height = 1000 |> px
                        , thickness = Distance.S |> Distance.translate |> px
                        , contentLeft = text "bla"
                        }
                    )
                    (List.map (howToBetStep color) steps)
                )
            ]
        )


lineBetweenSteps :
    { color : Color.Color
    , height : Length
    , thickness : Length
    , contentLeft : Element msg
    }
    -> Element msg
lineBetweenSteps param =
    row
        [ height param.height
        , width fill
        ]
        [ el [ width fill, height fill ] none
        , el
            [ param.color |> Color.translate |> Background.color
            , width param.thickness
            , height fill
            ]
            none
        , el [ width fill, height fill ] none
        ]


howToBetStep : Color.Color -> Element msg -> Element msg
howToBetStep frameColor step =
    el
        [ frameColor |> Color.translate |> Border.color
        , Border.widthEach
            { zeroEach
                | top = Distance.S |> Distance.translate
                , bottom = Distance.S |> Distance.translate
            }
        , fill |> width
        , Distance.XB |> Distance.translate |> padding
        ]
        step


howToBetStepTitle : { src : String, description : String } -> String -> String -> Element msg
howToBetStepTitle imageParam step title =
    row
        [ width fill
        , Distance.S |> Distance.translate |> spacing
        ]
        [ el [ width (fillPortion 1) ]
            (image
                [ fill |> maximum 200 |> width
                , centerX
                ]
                { src = imageParam.src
                , description = imageParam.description
                }
            )
        , el [ width (fillPortion 1), height fill ]
            (column
                [ alignRight
                , FontSize.XXXB
                    |> FontSize.translate
                    |> Font.size
                , fill |> maximum 200 |> width
                , height fill
                , centerX
                , Distance.XB |> Distance.translate |> spacing
                ]
                [ paragraph
                    [ alignTop
                    , Font.center
                    ]
                    [ text step ]
                , paragraph
                    [ centerY
                    , Font.center
                    , FontSize.XXB |> FontSize.translate |> Font.size
                    ]
                    [ text title ]
                ]
            )
        ]



-- Explanations #AccuracyFunction #HowToBet #WhatIsNoMaskDay


colorWhatIsNoMaskDay =
    Color.NeonPurple


colorHowToBet =
    Color.NeonBlue


colorAccuracyFunction =
    Color.NeonOrange


explanationPage : Color.Color -> List (Element msg) -> Element msg
explanationPage frameColor content =
    el
        ((Distance.M |> Distance.translate |> padding)
            :: basicPageLayout
        )
        (column
            [ frameColor |> Color.translate |> Border.color
            , Distance.S |> Distance.translate |> Border.width
            , Distance.M |> Distance.translate |> padding
            , Distance.XB |> Distance.translate |> spacing
            , fill |> width
            , fill |> height
            ]
            content
        )



-- ContacInfo


contactLayout : Element msg -> Element msg
contactLayout content =
    column
        (basicPageLayout
            ++ [ Distance.B |> Distance.translate |> padding ]
        )
        [ row
            [ shrink |> height
            , fill |> width
            ]
            [ el [ alignLeft ]
                contactBox
            , el
                [ fill |> height
                , fill |> width
                , Border.widthEach
                    { noBorder | bottom = 2 }
                , Color.NeonFuschia |> Color.translate |> Border.color
                ]
                (paragraph [ Distance.S |> Distance.translate |> padding ]
                    [ text "choose a name for public display and enter an e-mail for me to contact you privately" ]
                )
            ]
        , el [ Distance.B |> Distance.translate |> padding, width fill, height fill ] content
        ]


contactBox =
    colorBox Color.NeonFuschia
        [ column
            [ FontSize.XB
                |> FontSize.translate
                |> Font.size
            , Font.underline
            ]
            [ text "con", text "tact" ]
        ]


formStyle : List (Attribute msg)
formStyle =
    [ 150 |> px |> width
    , Color.Black
        |> Color.translateAlpha 1
        |> Background.color
    , Color.Black |> Color.translate |> Border.color
    , Distance.XXS |> Distance.translate |> Border.width
    , Distance.B |> Distance.translate |> padding
    , centerY
    , behindContent
        (el
            [ fill |> width
            , fill |> height
            , Distance.B |> Distance.translate |> padding
            ]
            (el
                [ fill |> width
                , fill |> height
                , Color.VeryGray |> Color.translate |> Border.color
                , Border.widthEach { noBorder | bottom = 1 }
                ]
                none
            )
        )
    ]


placeholderStyle =
    []


focusedBox =
    [ Color.NeonYellow
        |> Color.translate
        |> Border.color
    , Color.White
        |> Color.translate
        |> Font.color
    ]



-- Bet


betLayout : Element msg -> Element msg
betLayout content =
    column
        (basicPageLayout
            ++ [ Distance.B |> Distance.translate |> padding ]
        )
        [ row
            [ shrink |> height
            , fill |> width
            ]
            [ el [ alignLeft ]
                betBox
            , el
                [ fill |> height
                , fill |> width
                , Border.widthEach
                    { noBorder | bottom = 2 }
                , Color.NeonRed |> Color.translate |> Border.color
                ]
                (paragraph [ Distance.S |> Distance.translate |> padding ]
                    [ text "choose your points distribution by selecting date and spread" ]
                )
            ]
        , el [ Distance.B |> Distance.translate |> padding, width fill, height fill ] content
        ]


betBox =
    colorBox
        Color.NeonRed
        [ el
            [ width fill
            , FontSize.XXB
                |> FontSize.translate
                |> Font.size
            , Font.underline
            , alignBottom
            ]
            (el [ alignRight ] (text "bet"))
        ]


optionStyling : String -> Input.OptionState -> Element msg
optionStyling message optionState =
    let
        color =
            case optionState of
                Input.Idle ->
                    Color.VeryGray

                Input.Focused ->
                    Color.NeonBlue

                Input.Selected ->
                    Color.NeonBlue
    in
    el
        [ color |> Color.translate |> Font.color
        , Distance.XXXS |> Distance.translate |> Border.width
        , Distance.XS |> Distance.translate |> padding
        ]
        (text message)


textOption : value -> String -> Input.Option value msg
textOption value message =
    Input.optionWith value (optionStyling message)


betInputWrapper param content =
    row
        [ alignTop
        , height fill
        , Distance.S |> Distance.translate |> spacing
        ]
        [ column
            [ alignTop
            , height fill
            , param.kerning |> spacing
            , Border.widthEach { noBorder | right = 1 }
            , param.color |> Color.translate |> Border.color
            ]
            (List.map
                (\c -> el [ centerX ] (text c))
                (String.split "" param.text)
            )
        , content
        ]



-- Basic Layouts


paddingTop : Int -> Attribute msg
paddingTop x =
    paddingEach { top = x, right = 0, bottom = 0, left = 0 }


halfPage : Element msg -> Element msg
halfPage content =
    column [ width fill, height fill ]
        [ el [ height fill ] none
        , row [ width fill, height fill ]
            [ el [ width fill ] none
            , el [ width fill, height fill ] content
            , el [ width fill ] none
            ]
        , el [ height fill ] none
        ]


basicPage : List (Element msg) -> Element msg
basicPage content =
    column basicPageLayout content


layoutOverview : (model -> Element msg) -> model -> Element msg
layoutOverview content model =
    el
        [ width fill
        , height fill
        , Color.Black |> Color.translate |> Background.color
        ]
        (content model)



-- Links


externalLink : Color.Color -> String -> String -> Element msg
externalLink color url labelText =
    Element.link
        [ color |> Color.translate |> Font.color
        , Font.underline
        , focused [ Color.NeonYellow |> Color.translate |> (\x -> Border.glow x 1) ]
        , Html.Attributes.target "_blank" |> htmlAttribute
        ]
        { url = url
        , label = text labelText
        }


link : Color.Color -> Page -> String -> Element msg
link color page labelText =
    Element.link
        [ color |> Color.translate |> Font.color
        , Font.underline
        , focused [ Color.NeonYellow |> Color.translate |> (\x -> Border.glow x 1) ]
        ]
        { url = toLink page
        , label = text labelText
        }


pureLink : Page -> Element msg -> Element msg
pureLink page content =
    Element.link
        [ width fill
        , height fill
        , focused [ Color.NeonYellow |> Color.translate |> (\x -> Border.glow x 1) ]
        ]
        { url = toLink page
        , label = content
        }


fullLineLink : Color.Color -> Page -> String -> Element msg
fullLineLink color page labelText =
    Element.link
        [ color |> Color.translate |> Font.color
        , width fill
        ]
        { url = toLink page
        , label =
            Element.row
                [ width fill
                , 0 |> padding
                , 0 |> Border.width
                , color |> Color.translate |> Background.color
                ]
                [ el
                    [ width (fillPortion 1)
                    , color |> Color.translate |> Background.color
                    ]
                    (text "")
                , el
                    [ Color.Black |> Color.translate |> Background.color
                    , width (fillPortion 1)
                    , Font.underline
                    , Font.center
                    ]
                    (text labelText)
                , el
                    [ width (fillPortion 1)
                    , color |> Color.translate |> Background.color
                    ]
                    (text "")
                ]
        }



-- Buttons


basicButton : msg -> Distance.Size -> Color.Color -> String -> Element msg
basicButton msg paddingDist color buttonText =
    Input.button
        [ paddingDist |> Distance.translate |> padding
        , color |> Color.translate |> Border.color
        , Distance.XXXS |> Distance.translate |> Border.width
        , color |> Color.translate |> Font.color
        , myFocused
        ]
        { onPress = Just msg
        , label = el [ centerX, centerY ] (text buttonText)
        }



-- ColorBoxes


colorBox : Color.Color -> List (Element msg) -> Element msg
colorBox color content =
    column
        ([ color |> Color.translate |> Border.color
         , Distance.XXS |> Distance.translate |> Border.width
         ]
            ++ [ coloredBoxSize |> px |> height
               , coloredBoxSize |> px |> width
               ]
        )
        content



-- Bet-Elements
-- Old


overlay2 : Maybe msg -> String -> Attribute msg
overlay2 msg message =
    Element.column [ Distance.B |> Distance.translate |> spacing ]
        [ Element.text message
        , Input.button
            [ centerX
            , Color.Neutral |> Color.translate |> Background.color
            , Distance.XS |> Distance.translate |> Border.width
            , Distance.M |> Distance.translate |> padding
            , 60 |> px |> height
            , 60 |> px |> width
            , 30 |> Border.rounded
            , Border.glow (Color.FontNormal |> Color.translate) 0.8
            , Element.focused []
            , Element.mouseDown
                [ Color.NeutralDark |> Color.translate |> Background.color ]
            ]
            { onPress = msg
            , label = text "OK"
            }
        ]
        |> Element.el
            [ centerX
            , centerY
            ]
        |> Element.el
            [ centerX
            , centerY
            , Color.Highlight |> Color.translate |> Background.color
            , Color.FontNormal |> Color.translate |> Font.color
            , Distance.XB |> Distance.translate |> padding
            , Color.FontNormal |> Color.translate |> Border.color
            , Distance.M |> Distance.translate |> Border.width
            , 200 |> Border.rounded
            , 400 |> px |> width
            , 400 |> px |> height
            ]
        |> Element.el
            [ fill |> width
            , fill |> height
            , Color.Background |> Color.translateAlpha 0.8 |> Background.color
            ]
        |> Element.inFront



-- CustomEvents
-- Custom events


onEnter : msg -> Element.Attribute msg
onEnter =
    onEnterHtml >> Element.htmlAttribute


onEnterHtml : msg -> Html.Attribute msg
onEnterHtml msg =
    Html.Events.on "keyup"
        (Decode.field "key" Decode.string
            |> Decode.andThen
                (\key ->
                    if key == "Enter" then
                        Decode.succeed msg

                    else
                        Decode.fail "Not the enter key"
                )
        )


onBlur : msg -> Element.Attribute msg
onBlur msg =
    Element.htmlAttribute
        (Html.Events.onBlur msg)
