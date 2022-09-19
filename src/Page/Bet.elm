module Page.Bet exposing (..)

import AccuracyPlot.AccuracyPlot as AccuracyPlot
import Date as DateExt
import DatePicker.DatePicker as DatePicker
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Font as Font
import Element.Input
import Field.Confidence as Confidence
import Field.Field
import Html.Attributes
import Logic.Logic exposing (..)
import Logic.Router exposing (..)
import Time exposing (Month(..), Weekday(..))
import Ui.CustomElements as CustomEl
import Ui.Palette.Color as Color
import Ui.Palette.Distance as Distance
import Ui.Palette.FontSize as FontSize
import User.Guest as Guest
import User.Member as Member
import Valid.AutoCheck as AutoCheck
import Valid.Certified as Certified
import Valid.Valid


view : Model -> Element Msg
view model =
    CustomEl.betLayout
        (column [ width fill, height fill, Distance.XB |> Distance.translate |> spacing ]
            [ el
                [ width fill
                ]
                (row
                    [ centerX
                    , Distance.XB |> Distance.translate |> spacing
                    ]
                    [ chooseDate model
                    , chooseConfidence model
                    ]
                )
            , plotWrapper model
            ]
        )



-- Plot


plotWrapper model =
    let
        showPlot =
            case ( AutoCheck.object model.confidence, AutoCheck.object model.date ) of
                ( Just confidence, Just date ) ->
                    True

                ( _, _ ) ->
                    False
    in
    column
        [ fill |> minimum 200 |> height
        , width fill
        ]
        [ el
            [ width fill
            , height fill
            , htmlAttribute (Html.Attributes.id "accuracyPlot")
            , clip
            ]
            (viewPlot model)
        , el
            ([ alignLeft ]
                ++ (case ( AutoCheck.object model.confidence, AutoCheck.object model.date ) of
                        ( Just confidence, Just date ) ->
                            []

                        ( _, _ ) ->
                            [ inFront (el [ width fill, height fill, Color.Black |> Color.translate |> Background.color ] none) ]
                   )
            )
            (Element.Input.radioRow
                [ Distance.M |> Distance.translate |> padding
                , Distance.S |> Distance.translate |> spacing
                , width fill
                ]
                { onChange = PlotYears
                , selected = Just model.plotRange
                , label = Element.Input.labelHidden "Show:"
                , options =
                    [ CustomEl.textOption Till2022 "1 month"
                    , CustomEl.textOption Till2023 "1 semester"
                    , CustomEl.textOption Till2024 "all years"
                    ]
                }
            )
        ]


viewPlot : Model -> Element Msg
viewPlot model =
    case ( AutoCheck.object model.confidence, AutoCheck.object model.date ) of
        ( Just confidence, Just date ) ->
            Element.el [ width fill, height fill ]
                (AccuracyPlot.plotView
                    { model = model.plot
                    , spread = Confidence.toInt confidence
                    , date = date
                    , dateRange =
                        dateRange model
                    , msgChannel = PlotMsg
                    }
                )

        ( _, _ ) ->
            Element.column
                [ centerX
                , centerY
                , Font.justify
                , Distance.M |> Distance.translate |> spacing
                , Distance.B |> Distance.translate |> padding
                , 1 |> Border.width
                ]
                [ Element.paragraph
                    [ centerX
                    , centerY
                    , width (px 220)
                    , Font.justify
                    ]
                    [ text "You will see your points distribution here after you have selected date and spread " ]
                , Element.paragraph [ centerX, centerY, Font.center ]
                    [ text "[Hint: you can click the x-Axis]"
                    ]
                ]


chooseDate model =
    CustomEl.betInputWrapper
        { text = "date"
        , kerning = 1
        , color = Color.NeonRed
        }
    <|
        DatePicker.pickerView
            { settings = datePickerSettings
            , picker = DatePicker.toPicker model.datePicker
            , selected = AutoCheck.publicObject model.date
            , onChange = DatePickerEvent
            }


chooseConfidence model =
    CustomEl.betInputWrapper
        { text = "spread"
        , kerning = -1
        , color = Color.NeonBlue
        }
    <|
        confidenceSlider model


confidenceSlider model =
    column [ height fill ]
        [ el
            [ 30 |> px |> width
            , 30 |> px |> height
            , Color.NeonBlue |> Color.translate |> Font.color
            , Font.bold
            ]
            (case AutoCheck.publicObject model.confidence of
                Just confidence ->
                    el [ width fill, height fill, 1 |> Border.width ]
                        (el [ centerX, centerY ]
                            (text (Confidence.toString confidence))
                        )

                Nothing ->
                    Element.none
            )
        , Element.Input.slider
            [ height fill
            , 30 |> px |> width

            {- , Color.NeonBlue
               |> Color.translateAlpha 0.5
               |> Background.color
            -}
            -- Here is where we're creating/styling the "track"
            , Element.behindContent
                (Element.el
                    [ height fill
                    , 2 |> px |> width
                    , Element.centerX
                    , Color.White |> Color.translate |> Background.color
                    , Border.rounded 2
                    ]
                    Element.none
                )
            ]
            { onChange = round >> SetConfidence
            , label =
                Element.Input.labelHidden "spread slider"
            , min = 0
            , max = 100
            , step = Just 1
            , value =
                model.confidence
                    |> AutoCheck.publicObject
                    |> Maybe.map Confidence.toInt
                    |> Maybe.withDefault 0
                    |> toFloat
            , thumb =
                Element.Input.defaultThumb
            }
        ]


datePickerSettings : DatePicker.Settings
datePickerSettings =
    { firstDayOfWeek = Time.Mon
    , language = Nothing
    , disabled = \d -> not (DateExt.isBetween startOfBet endOfBet d)
    , pickerAttributes =
        [ centerX
        , alignTop
        , FontSize.M |> FontSize.translate |> Font.size
        , Font.center
        ]
    , headerAttributes =
        [ width fill
        , Distance.XS
            |> Distance.translate
            |> padding
        ]
    , tableAttributes =
        [ centerX
        , centerY
        , 25 + 30 * 6 |> px |> height
        , 30 * 7 |> px |> width
        ]
    , weekdayAttributes =
        [ alignTop
        , 25 |> px |> height
        ]
    , dayAttributes =
        [ 30 |> px |> height
        , 30 |> px |> width
        , Font.center
        ]
    , wrongMonthDayAttributes =
        [ Color.VeryGray |> Color.translate |> Font.color ]
    , todayDayAttributes = []
    , selectedDayAttributes =
        [ Color.NeonRed |> Color.translate |> Font.color
        , Font.bold
        , 1 |> Border.width
        ]
    , disabledDayAttributes = [ Font.strike ]
    , previousMonthElement =
        el [ Distance.M |> Distance.translate |> padding ] (Element.text "◀")
    , nextMonthElement =
        Element.text "▶"
    }
