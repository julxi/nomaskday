module AccuracyPlot.AccuracyPlot exposing (..)

import Browser.Dom
import Date exposing (Date)
import Element exposing (Attribute, Element, column, el, row)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Html
import Html.Attributes
import Html.Events
import Html.Events.Extra.Mouse as Mouse
import Json.Decode as Decode
import Round exposing (round)
import Svg exposing (..)
import Svg.Attributes exposing (..)
import Svg.Events exposing (..)
import Task
import Time exposing (Month(..), Weekday(..))
import Ui.CustomElements as CustomEl
import Ui.Palette.Color as Color
import Ui.Palette.Distance as Distance
import Ui.Palette.FontSize as FontSize


type alias Model =
    { plotDomId : String
    , dateLeft : Date.Date
    , inputLeft : String
    , dateRight : Date.Date
    , inputRight : String
    , autoBorders : Bool
    , currentDataPoint : Maybe Int
    , paddingLeft : Float
    , paddingRight : Float
    , paddingTop : Float
    , paddingBottom : Float
    , plotWidth : Float
    , plotHeight : Float

    --Test
    , test1 : Float
    , test2 : Float
    }


init : Model
init =
    let
        initDateLeft =
            Date.fromCalendarDate 2021 Jan 1

        initDateRight =
            Date.fromCalendarDate 2021 Dec 31
    in
    { plotDomId = "accuracyPlot"
    , dateLeft = initDateLeft
    , inputLeft = Date.toIsoString initDateLeft
    , dateRight = initDateRight
    , inputRight = Date.toIsoString initDateRight
    , currentDataPoint = Nothing
    , autoBorders = True
    , paddingLeft = 0
    , paddingRight = 0
    , paddingTop = 0
    , paddingBottom = 0
    , plotWidth = 0
    , plotHeight = 0

    --Test
    , test1 = 50
    , test2 = 0
    }


initWithBorders : Date -> Date -> Model
initWithBorders left right =
    updateBorders left right init


setSize : { width : Float, height : Float } -> Model -> Model
setSize { width, height } model =
    { model | plotWidth = width, plotHeight = height }


type Msg
    = SetLeftBorder Date.Date
    | SetRightBorder Date.Date
    | InputLeftBorder String
    | SubmitLeftBorder
    | InputRightBorder String
    | SubmitRightBorder
    | AutoBorder Bool
    | ToggleAutoBorder
    | UpdateBorders Date.Date Date.Date Float
    | UpdatePlotWidth (Result Browser.Dom.Error Browser.Dom.Element)
    | NewPlotWidth
    | NoAction
    | SetCurrentDataPoint Int
    | PercentSetCurrentDataPoint Float
    | UnsetCurrentDataPoint
      --Test
    | SetTest1 Float


updateBorders : Date -> Date -> Model -> Model
updateBorders left right model =
    if Date.toRataDie left < Date.toRataDie right then
        { model
            | dateLeft = left
            , dateRight = right
            , inputLeft = Date.toIsoString left
            , inputRight = Date.toIsoString right

            --, currentDataPoint = Nothing
        }

    else
        model


updateInterval : Maybe Date -> Maybe Int -> Date -> Model -> Model
updateInterval betDate confidence today model =
    case ( betDate, confidence ) of
        ( Just d, Just c ) ->
            let
                betRD =
                    Date.toRataDie d |> toFloat

                todayRD =
                    Date.toRataDie today |> toFloat

                rightRD =
                    Basics.min (betRD + 600) (betRD + 4238.68 / toFloat c)

                leftRD =
                    Basics.max todayRD (Basics.max (betRD - 600) (betRD - 4238.68 / toFloat c))

                dateLeft =
                    if betRD > 0.8 * leftRD + 0.2 * rightRD then
                        leftRD
                            |> Round.roundNum 0
                            |> Round.truncate
                            |> Date.fromRataDie

                    else
                        ((betRD - 0.2 * rightRD) / 0.8)
                            |> Round.roundNum 0
                            |> Round.truncate
                            |> Date.fromRataDie

                dateRight =
                    rightRD |> Round.truncate |> Date.fromRataDie
            in
            if model.autoBorders then
                { model
                    | dateLeft = dateLeft
                    , inputLeft = dateLeft |> Date.toIsoString
                    , dateRight = dateRight
                    , inputRight = dateRight |> Date.toIsoString
                    , currentDataPoint = Nothing
                }

            else
                model

        _ ->
            model


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    let
        convertToDate : String -> Date -> Date
        convertToDate text fallback =
            case Date.fromIsoString text of
                Ok date ->
                    date

                Err _ ->
                    fallback
    in
    case msg of
        SetCurrentDataPoint date ->
            ( { model | currentDataPoint = Just date }, Cmd.none )

        PercentSetCurrentDataPoint percent ->
            ( { model | currentDataPoint = Just (percentToDataPoint model percent) }, Cmd.none )

        UnsetCurrentDataPoint ->
            ( { model | currentDataPoint = Nothing }, Cmd.none )

        NoAction ->
            ( model, Cmd.none )

        SetLeftBorder date ->
            if Date.toRataDie date < Date.toRataDie model.dateRight then
                ( { model
                    | dateLeft = date
                    , inputLeft = Date.toIsoString date
                    , currentDataPoint = Nothing
                  }
                , Cmd.none
                )

            else
                ( { model | inputLeft = Date.toIsoString model.dateLeft }, Cmd.none )

        InputLeftBorder input ->
            ( { model | inputLeft = input }, Cmd.none )

        SubmitLeftBorder ->
            let
                newDate =
                    convertToDate model.inputLeft model.dateLeft
            in
            update (SetLeftBorder newDate) model

        SetRightBorder date ->
            if Date.toRataDie date > Date.toRataDie model.dateLeft then
                ( { model
                    | dateRight = date
                    , inputRight = Date.toIsoString date
                    , currentDataPoint = Nothing
                  }
                , Cmd.none
                )

            else
                ( { model | inputRight = Date.toIsoString model.dateRight }, Cmd.none )

        InputRightBorder input ->
            ( { model | inputRight = input }, Cmd.none )

        SubmitRightBorder ->
            let
                newDate =
                    convertToDate model.inputRight model.dateRight
            in
            update (SetRightBorder newDate) model

        AutoBorder bool ->
            ( { model | autoBorders = bool }, Cmd.none )

        ToggleAutoBorder ->
            ( { model | autoBorders = not model.autoBorders }, Cmd.none )

        UpdateBorders userDate today confidence ->
            let
                dateRD =
                    userDate |> Date.toRataDie |> toFloat

                dateLeft =
                    Date.toRataDie today

                dateRight =
                    dateRD + Basics.min 1800 (dateRD - dateRD * (80 / confidence))
            in
            ( { model
                | dateLeft = dateLeft |> Date.fromRataDie
                , inputLeft = dateLeft |> Date.fromRataDie |> Date.toIsoString
                , dateRight = dateRight |> Round.truncate |> Date.fromRataDie
                , inputRight = dateRight |> Round.truncate |> Date.fromRataDie |> Date.toIsoString
              }
            , Cmd.none
            )

        UpdatePlotWidth res ->
            case res of
                Ok elm ->
                    ( { model | plotWidth = elm.element.width, plotHeight = elm.element.height }, Cmd.none )

                Err _ ->
                    ( model, Cmd.none )

        NewPlotWidth ->
            ( model, Task.attempt UpdatePlotWidth (Browser.Dom.getElement model.plotDomId) )

        --Test
        SetTest1 float ->
            ( { model | test1 = float }, Cmd.none )


plotView : PlotConfig msg -> Element msg
plotView config =
    el
        [ Element.centerX
        , Element.centerY
        ]
        (drawGraph config |> Element.html)


type alias PlotConfig msg =
    { model : Model
    , userDate : Date.Date
    , userConfidence : Float
    , msgChannel : Msg -> msg
    }


drawGraph : PlotConfig msg -> Html.Html msg
drawGraph config =
    let
        model =
            config.model

        screenArea =
            { xMin = 0
            , xMax = model.plotWidth
            , yMin = 0
            , yMax = model.plotHeight
            }

        drawArea =
            { xMin = screenArea.xMin + 50
            , xMax = screenArea.xMax - 15
            , yMin = screenArea.yMin + 30
            , yMax = screenArea.yMax - 35
            }

        plotArea =
            { xMin = drawArea.xMin + 10
            , xMax = drawArea.xMax - 10
            , yMin = drawArea.yMin + 10
            , yMax = drawArea.yMax - 10
            }

        -- Special dates (dates are always in RataDie)
        dMin =
            Date.toRataDie model.dateLeft

        dMax =
            Date.toRataDie model.dateRight

        dVip =
            Date.toRataDie config.userDate

        dDelta =
            -- First factor is roughly the distance between dots
            -- choose whatever you want
            12 * (dMax - dMin |> toFloat) / (plotArea.xMax - plotArea.xMin)

        dMaxValue =
            if dMin <= dVip && dVip <= dMax then
                dVip

            else if (dVip - dMin) < (dMax - dVip) then
                dMin

            else
                dMax

        dMinValue =
            if (dVip - dMin) < (dMax - dVip) then
                dMax

            else
                dMin

        -- Value conversion to aboslute position on svg-srceen
        dateToPos : Int -> Float
        dateToPos date =
            plotArea.xMin
                + toFloat (date - dMin)
                * (plotArea.xMax - plotArea.xMin)
                / toFloat (dMax - dMin)

        posToDate : Float -> Float
        posToDate x =
            ((x - plotArea.xMin)
                * toFloat dMax
                + (plotArea.xMax - x)
                * toFloat dMax
            )
                / (plotArea.xMax - plotArea.xMin)

        accuracyToPos : Float -> Float
        accuracyToPos accuracy =
            plotArea.yMax + accuracy * (plotArea.yMin - plotArea.yMax)

        --Axis and Ticks
        offSetAxis =
            15

        dateToPointOnAxisX : Int -> ( Float, Float )
        dateToPointOnAxisX date =
            ( dateToPos date, plotArea.yMax + offSetAxis )

        dateToPointOnAxisY : Float -> ( Float, Float )
        dateToPointOnAxisY acc =
            ( plotArea.xMin - offSetAxis, accuracyToPos acc )

        yAxis =
            line
                [ plotArea.xMin - offSetAxis |> Round.round 2 |> x1
                , plotArea.yMax + offSetAxis |> Round.round 2 |> y1
                , plotArea.xMin - offSetAxis |> Round.round 2 |> x2
                , plotArea.yMin - offSetAxis |> Round.round 2 |> y2
                , Color.White |> Color.toString |> stroke
                , "url(#triangle)" |> markerEnd
                ]
                []

        xAxis =
            line
                [ plotArea.xMin - offSetAxis |> Round.round 2 |> x1
                , plotArea.yMax + offSetAxis |> Round.round 2 |> y1
                , plotArea.xMax + offSetAxis |> Round.round 2 |> x2
                , plotArea.yMax + offSetAxis |> Round.round 2 |> y2
                , Color.White |> Color.toString |> stroke
                , "url(#triangle)" |> markerEnd
                ]
                []

        tick : Float -> Float -> Char -> Svg msg
        tick xPos yPos orientation =
            let
                thickness =
                    3

                longness =
                    10

                tickColor =
                    Color.White |> Color.toString
            in
            case orientation of
                'v' ->
                    line
                        [ xPos |> Round.round 2 |> x1
                        , yPos + longness / 2 |> Round.round 2 |> y1
                        , xPos |> Round.round 2 |> x2
                        , yPos - longness / 2 |> Round.round 2 |> y2
                        , tickColor |> stroke
                        , thickness |> Round.round 2 |> strokeWidth
                        ]
                        []

                'h' ->
                    line
                        [ xPos - longness / 2 |> Round.round 2 |> x1
                        , yPos |> Round.round 2 |> y1
                        , xPos + longness / 2 |> Round.round 2 |> x2
                        , yPos |> Round.round 2 |> y2
                        , tickColor |> stroke
                        , thickness |> Round.round 2 |> strokeWidth
                        ]
                        []

                _ ->
                    circle [] []

        xTick : Float -> Svg msg
        xTick xPos =
            tick xPos (plotArea.yMax + offSetAxis) 'v'

        xTickSmall : Color.Color -> Float -> Svg msg
        xTickSmall color xPos =
            let
                thickness =
                    1

                longness =
                    5

                yPos =
                    plotArea.yMax + offSetAxis

                tickColor =
                    color |> Color.toString
            in
            line
                [ xPos |> Round.round 2 |> x1
                , yPos + longness |> Round.round 2 |> y1
                , xPos |> Round.round 2 |> x2
                , yPos |> Round.round 2 |> y2
                , tickColor |> stroke
                , thickness |> Round.round 2 |> strokeWidth
                ]
                []

        dateTick : Int -> List (Svg msg)
        dateTick date =
            let
                xPos =
                    dateToPos date
            in
            [ xTick xPos
            , text_
                [ plotArea.yMax + offSetAxis + 25 |> Round.round 2 |> y
                , xPos - 50 |> Round.round 2 |> x
                , "0" |> rotate
                , Color.White |> Color.toString |> fill
                ]
                [ date
                    |> Date.fromRataDie
                    |> Date.format "MMM ddd"
                    |> text
                ]
            ]

        borderTick : Int -> String -> (String -> msg) -> msg -> List (Svg msg)
        borderTick date text inputMsg submitMsg =
            let
                xPos =
                    dateToPos date
            in
            [ line
                [ xPos |> Round.round 2 |> x1
                , plotArea.yMax + offSetAxis |> Round.round 2 |> y1
                , xPos |> Round.round 2 |> x2
                , plotArea.yMax + offSetAxis + 40 |> Round.round 2 |> y2
                , Color.FontNormal |> Color.toString |> stroke
                , "1" |> strokeWidth
                ]
                []
            , xTick xPos
            , foreignObject
                [ plotArea.yMax + offSetAxis + 40 |> Round.round 2 |> y
                , xPos - 40 |> Round.round 2 |> x
                , "90" |> width
                , "25" |> height
                ]
                [ Html.input
                    [ Html.Attributes.placeholder text
                    , Html.Attributes.width 20
                    , Html.Attributes.height 10
                    , Html.Attributes.size 4
                    , text |> Html.Attributes.value
                    , model.autoBorders |> Html.Attributes.disabled
                    , inputMsg |> Html.Events.onInput
                    , submitMsg |> Html.Events.onBlur
                    , submitMsg |> CustomEl.onEnterHtml
                    ]
                    []
                ]
            ]

        {- ++ borderTick
           dMin
           config.model.inputLeft
           (InputLeftBorder >> config.msgChannel)
           (SubmitLeftBorder |> config.msgChannel)
        -}
        accuracyTick : Float -> List (Svg msg)
        accuracyTick yValue =
            let
                yPos =
                    plotToScreenY yValue
            in
            [ line
                [ plotArea.xMin - offSetAxis - 5 |> Round.round 2 |> x1
                , yPos |> Round.round 2 |> y1
                , plotArea.xMin - offSetAxis + 5 |> Round.round 2 |> x2
                , yPos |> Round.round 2 |> y2
                , Color.White |> Color.toString |> stroke
                , "2" |> strokeWidth
                ]
                []
            , text_
                [ yPos + 7 |> Round.round 2 |> y
                , plotArea.xMin - offSetAxis - 5 - 40 |> Round.round 2 |> x
                , Color.White |> Color.toString |> fill
                ]
                [ yValue |> Round.round 2 |> text
                ]
            ]

        accuracyTick2 : Float -> List (Svg msg)
        accuracyTick2 yValue =
            let
                yPos =
                    plotToScreenY yValue
            in
            [ line
                [ plotArea.xMin - offSetAxis - 5 |> Round.round 2 |> x1
                , yPos |> Round.round 2 |> y1
                , plotArea.xMin - offSetAxis + 5 |> Round.round 2 |> x2
                , yPos |> Round.round 2 |> y2
                , Color.White |> Color.toString |> stroke
                , "2" |> strokeWidth
                ]
                []
            , rect
                [ yPos - 8 |> Round.round 2 |> y
                , plotArea.xMin
                    - offSetAxis
                    - 5
                    - 40
                    |> Round.round 2
                    |> x
                , "30" |> width
                , "18" |> height
                , Color.Black
                    |> Color.toString
                    |> (\s -> s ++ "99" |> fill)
                ]
                []
            , text_
                [ yPos + 7 |> Round.round 2 |> y
                , plotArea.xMin - offSetAxis - 5 - 40 |> Round.round 2 |> x
                , Color.White |> Color.toString |> fill
                ]
                [ yValue |> Round.round 2 |> text
                ]
            ]

        -- ContinousPlot now AllDatesPlot
        allDates =
            List.range
                dMin
                dMax

        makePointFromDate : Int -> Svg msg
        makePointFromDate date =
            circle
                [ date |> dateToPos |> Round.round 2 |> cx
                , date
                    |> accuracyFromDate
                    |> accuracyToPos
                    |> Round.round 2
                    |> cy
                , r "1"
                , Color.White |> Color.toString |> fill
                ]
                []

        plot =
            List.map makePointFromDate allDates

        --x |> Date |>
        -- Data Points
        accuracyFromDate : Int -> Float
        accuracyFromDate date =
            accuracyFunction
                (config.userConfidence / 100)
                (toFloat (date - (config.userDate |> Date.toRataDie)))

        makeColorDot : String -> Int -> Int -> Svg msg
        makeColorDot col compareDate date =
            -- maps [0,1] coordinate on plot area
            let
                accuracy =
                    accuracyFunction
                        (config.userConfidence / 100)
                        (date - compareDate |> toFloat)
            in
            circle
                [ date |> dateToPos |> Round.round 2 |> cx
                , accuracy |> accuracyToPos |> Round.round 2 |> cy
                , r "4"
                , col |> fill
                , SetCurrentDataPoint date
                    |> config.msgChannel
                    |> onMouseOver
                ]
                []

        makeDot : Int -> Int -> Svg msg
        makeDot compareDate date =
            -- maps [0,1] coordinate on plot area
            let
                accuracy =
                    accuracyFunction
                        (config.userConfidence / 100)
                        (date - compareDate |> toFloat)
            in
            circle
                [ date |> dateToPos |> Round.round 2 |> cx
                , accuracy |> accuracyToPos |> Round.round 2 |> cy
                , r "4"

                --, Color.NeutralDark |> Color.toString |> fill
                , Color.White |> Color.toString |> fill

                --, UnsetCurrentDataPoint
                --  |> config.msgChannel
                --  |> onMouseOut
                , SetCurrentDataPoint date
                    |> config.msgChannel
                    |> onMouseOver
                ]
                []

        datesBetween : Int -> Int -> Float -> List Int
        datesBetween dL dR delta =
            let
                k =
                    toFloat (dR - dL) / delta + 1 |> floor
            in
            List.map
                (\i -> dL + i * (dR - dL) // (k - 1))
                (List.range 1 (k - 1))

        dataPointList =
            if dMin <= dVip && dVip <= dMax then
                makeColorDot
                    (Color.NeonBlue |> Color.toString)
                    dVip
                    dVip
                    :: List.map
                        (makeColorDot (Color.White |> Color.toString)
                            dVip
                        )
                        ([ dMin, dMax ]
                            ++ datesBetween dMin (dVip - 1) dDelta
                            ++ datesBetween (dVip + 1) dMax dDelta
                        )

            else
                List.map
                    (makeDot dVip)
                    ([ dMin, dMax ] ++ datesBetween dMin dMax dDelta)

        -- highlighting
        highlighting : Maybe Int -> List (Svg msg)
        highlighting selectedDatapoint =
            case selectedDatapoint of
                Just date ->
                    let
                        xPos =
                            date |> dateToPos

                        yPos =
                            date |> accuracyFromDate |> accuracyToPos
                    in
                    [ line
                        [ plotArea.xMin - offSetAxis |> Round.round 2 |> x1
                        , yPos |> Round.round 2 |> y1
                        , xPos |> Round.round 2 |> x2
                        , yPos |> Round.round 2 |> y2
                        , "gray" |> stroke
                        , "1" |> strokeWidth
                        ]
                        []
                    , line
                        [ xPos |> Round.round 2 |> x1
                        , plotArea.yMax + offSetAxis |> Round.round 2 |> y1
                        , xPos |> Round.round 2 |> x2
                        , yPos |> Round.round 2 |> y2
                        , "gray" |> stroke
                        , "1" |> strokeWidth
                        ]
                        []
                    ]
                        ++ accuracyTick2 (accuracyFromDate date)
                        ++ dateTick date

                Nothing ->
                    []

        dateDistance : Date.Date -> Date.Date -> Int
        dateDistance x y =
            Date.toRataDie y - Date.toRataDie x

        dateDistanceMin =
            dateDistance config.userDate model.dateLeft

        dateDistanceMax =
            dateDistance config.userDate model.dateRight

        dateDistanceToX : Int -> Float
        dateDistanceToX k =
            toFloat (k - dateDistanceMin) / toFloat (dateDistanceMax - dateDistanceMin)

        xToDate : Float -> Date
        xToDate x =
            x
                * toFloat dateDistanceMax
                + (1 - x)
                * toFloat dateDistanceMin
                + (config.userDate |> Date.toRataDie |> toFloat)
                |> Round.truncate
                |> Date.fromRataDie

        showDatapoint data =
            let
                x =
                    data.distance |> dateDistanceToX

                y =
                    data.distance |> toFloat |> accuracyFunction (config.userConfidence / 100)

                tick1 =
                    if data.hasXTick == True then
                        let
                            date =
                                Date.fromRataDie (Date.toRataDie config.userDate + data.distance)
                        in
                        dateTick (Date.toRataDie date)

                    else
                        []

                tick2 =
                    if data.hasYTick == True then
                        accuracyTick y

                    else
                        []
            in
            [ dot ( x, y ) ] ++ tick1 ++ tick2

        plotToScreenX : Float -> Float
        plotToScreenX x =
            plotArea.xMin + x * (plotArea.xMax - plotArea.xMin)

        plotToScreenY : Float -> Float
        plotToScreenY y =
            plotArea.yMax + y * (plotArea.yMin - plotArea.yMax)

        dot : ( Float, Float ) -> Svg msg
        dot ( x, y ) =
            -- maps [0,1] coordinate on plot area
            let
                newX =
                    plotArea.xMin + x * (plotArea.xMax - plotArea.xMin)

                newY =
                    plotArea.yMax + y * (plotArea.yMin - plotArea.yMax)
            in
            circle
                [ x |> plotToScreenX |> Round.round 2 |> cx
                , y |> plotToScreenY |> Round.round 2 |> cy
                , r "4"
                , UnsetCurrentDataPoint
                    |> config.msgChannel
                    |> onMouseOut
                , SetCurrentDataPoint 0
                    |> config.msgChannel
                    |> onMouseOver
                ]
                []

        dotDistance =
            5

        amountOfDots =
            plotArea.xMax - plotArea.xMin / dotDistance

        -- Year Decoration
        listOfYears =
            List.range
                (dMin |> Date.fromRataDie |> Date.year)
                (dMax |> Date.fromRataDie |> Date.year)

        endOfYearPos int =
            Date.fromCalendarDate int Time.Dec 31
                |> Date.toRataDie
                |> dateToPos

        middleOfYearPos year =
            (dateToPos
                (Date.toRataDie
                    (Date.fromCalendarDate year Time.Jan 1)
                )
                + dateToPos
                    (Date.toRataDie
                        (Date.fromCalendarDate year Time.Dec 31)
                    )
            )
                / 2

        yearTag year xPos =
            text_
                [ plotArea.yMax + offSetAxis + 10 |> Round.round 2 |> y
                , xPos |> Round.round 2 |> x
                , Color.White |> Color.toString |> fill
                , FontSize.S
                    |> FontSize.translate
                    |> String.fromInt
                    |> (\s -> s ++ "px")
                    |> fontSize
                ]
                [ year |> String.fromInt |> text ]

        yearTicks =
            case listOfYears of
                [] ->
                    []

                yearMin :: rest ->
                    endOfYearPos (yearMin - 1)
                        :: List.map endOfYearPos (yearMin :: rest)
    in
    svg
        [ screenArea.xMax - screenArea.xMin |> Round.round 2 |> width
        , screenArea.yMax - screenArea.yMin |> Round.round 2 |> height
        , [ screenArea.xMin
          , screenArea.yMin
          , screenArea.xMax - screenArea.xMin
          , screenArea.yMax - screenArea.yMin
          ]
            |> List.map (Round.round 2)
            |> String.join " "
            |> viewBox
        ]
        ([ defs []
            [ marker
                [ "triangle" |> id
                , "0 0 10 10" |> viewBox
                , "1" |> refX
                , "5" |> refY
                , "strokeWidth" |> markerUnits
                , "10" |> markerWidth
                , "10" |> markerHeight
                , "auto" |> orient
                , Color.White |> Color.toString |> fill
                ]
                [ Svg.path [ "M 0 0 L 10 5 L 0 10 z" |> d ] [] ]
            ]
         , rect
            [ Color.Black |> Color.toString |> fill
            , screenArea.xMin |> Round.round 2 |> x
            , screenArea.yMin |> Round.round 2 |> y
            , screenArea.xMax - screenArea.xMin |> Round.round 2 |> width
            , screenArea.yMax - screenArea.yMin |> Round.round 2 |> height
            , UnsetCurrentDataPoint |> config.msgChannel |> onClick
            ]
            []
         ]
            ++ [ text_
                    [ "10" |> x
                    , "10" |> y
                    , Color.White |> Color.toString |> fill

                    --, "translate(40,75) rotate(-90)" |> transform
                    ]
                    [ "accuracy" |> text ]
               ]
            ++ [ xAxis, yAxis ]
            ++ [ line
                    [ plotArea.xMin |> Round.round 2 |> x1
                    , plotArea.yMax + offSetAxis |> Round.round 2 |> y1
                    , plotArea.xMax |> Round.round 2 |> x2
                    , plotArea.yMax + offSetAxis |> Round.round 2 |> y2
                    , Color.NeonFuschia |> Color.toString |> stroke
                    , "2" |> width
                    , "3" |> strokeWidth
                    ]
                    []
               ]
            ++ List.map (xTickSmall Color.White) yearTicks
            ++ List.map
                (\year -> yearTag year (middleOfYearPos year))
                listOfYears
            ++ (dMaxValue
                    |> accuracyFromDate
                    |> accuracyTick
               )
            ++ (dMinValue
                    |> accuracyFromDate
                    |> accuracyTick
               )
            --++ dateTick dMin
            --++ dateTick dMax
            ++ highlighting config.model.currentDataPoint
            ++ plot
            -- Test
            {- ++ [ text_
                    [ "200" |> y
                    , "200" |> x
                    , Color.White |> Color.toString |> fill
                    ]
                    [ model.test1
                        |> Round.round 2
                        |> text
                    ]
               ]
            -}
            ++ [ foreignObject
                    [ plotArea.xMin
                        |> Round.round 2
                        |> x
                    , plotArea.xMax
                        - plotArea.xMin
                        |> Round.round 2
                        |> width
                    , plotArea.yMax
                        |> Round.round 2
                        |> y
                    , "60" |> height
                    ]
                    [ Element.layoutWith
                        { options =
                            [ Element.noStaticStyleSheet
                            , Element.focusStyle
                                { borderColor = Nothing
                                , backgroundColor = Nothing
                                , shadow = Nothing
                                }
                            ]
                        }
                        []
                        (Input.slider
                            [ Element.centerY
                            , 60
                                |> Element.px
                                |> Element.height
                            , Element.width Element.fill

                            {- , Color.NeonFuschia
                               |> Color.translateAlpha 0.5
                               |> Background.color
                            -}
                            ]
                            { onChange = PercentSetCurrentDataPoint >> config.msgChannel
                            , label =
                                Input.labelHidden
                                    "My Slider Value"
                            , min = 0
                            , max = 100
                            , step = Nothing
                            , value = model.test1
                            , thumb =
                                myThump
                            }
                        )
                    ]
               ]
        )


percentToDataPoint : Model -> Float -> Int
percentToDataPoint model percent =
    (1 - percent / 100)
        * toFloat (Date.toRataDie model.dateLeft)
        + (percent / 100)
        * toFloat (Date.toRataDie model.dateRight)
        |> Round.truncate


myThump =
    Input.thumb
        []


accuracyFunction : Float -> Float -> Float
accuracyFunction c x =
    c * e ^ -((c * x / 36) ^ 2) + (1 - c) * 0.25


toEngMonth : Month -> String
toEngMonth month =
    case month of
        Jan ->
            "Jan"

        Feb ->
            "Feb"

        Mar ->
            "Mar"

        Apr ->
            "Apr"

        May ->
            "May"

        Jun ->
            "Jun"

        Jul ->
            "Jul"

        Aug ->
            "Aug"

        Sep ->
            "Sep"

        Oct ->
            "Oct"

        Nov ->
            "Nov"

        Dec ->
            "Dec"
