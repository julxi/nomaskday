module AccuracyPlot.AccuracyPlot exposing (..)

import AccuracyPlot.Function as Function
import AccuracyPlot.SvgPicture
import Array exposing (Array(..))
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
import Svg.Lazy
import Task
import Time exposing (Month(..), Weekday(..))
import Ui.CustomElements as CustomEl
import Ui.Palette.Color as Color exposing (Color(..))
import Ui.Palette.Distance as Distance
import Ui.Palette.FontSize as FontSize


type alias Model =
    { --Presentation Details
      plotWidth : Float
    , plotHeight : Float
    , paddingAxis :
        { left : Float
        , right : Float
        , top : Float
        , bottom : Float
        }
    , paddingGraph :
        { left : Float
        , right : Float
        , top : Float
        , bottom : Float
        }

    -- Details about the bet
    , startOfBet : Int
    , endOfBet : Int

    --Highlighting
    , currentDataPoint : Maybe Int
    , highlightedDataPoint : Maybe Int

    --Test Stuff
    , sliderValue : Float
    }


init : Model
init =
    let
        initDateLeft =
            Date.fromCalendarDate 2021 Jan 1

        initDateRight =
            Date.fromCalendarDate 2021 Dec 31
    in
    { plotWidth = 0
    , plotHeight = 0
    , paddingAxis =
        { left = 60
        , right = 25
        , top = 30
        , bottom = 35
        }
    , paddingGraph =
        { left = 10
        , right = 10
        , top = 10
        , bottom = 10
        }

    --Details about the bet
    , startOfBet = 0
    , endOfBet = 0

    --Highlighting
    , currentDataPoint = Nothing
    , highlightedDataPoint = Nothing

    --Test Stuff
    , sliderValue = 0
    }



--External Actions


setSize : { width : Float, height : Float } -> Model -> Model
setSize { width, height } model =
    { model | plotWidth = width, plotHeight = height }


setStartAndEnd : Date -> Date -> Model -> Model
setStartAndEnd startOfBet endOfBet model =
    { model
        | startOfBet = Date.toRataDie startOfBet
        , endOfBet = Date.toRataDie endOfBet
    }


removeHighlight : Model -> Model
removeHighlight model =
    { model
        | highlightedDataPoint = Nothing
        , currentDataPoint = Nothing
    }



--Update


type Msg
    = NoOp
      -- Highlighting
    | SetHighlight Int
    | RemoveHighlight
    | TouchOnXAxis (Range Int) Float


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
        NoOp ->
            ( model, Cmd.none )

        SetHighlight date ->
            ( { model | highlightedDataPoint = Just date }, Cmd.none )

        TouchOnXAxis dateRange touchPos ->
            let
                highlightedDataPoint =
                    Round.truncate
                        (linearTransform
                            { min = toFloat dateRange.min
                            , max = toFloat dateRange.max
                            }
                            { min = 0, max = 1000 }
                            touchPos
                        )
            in
            ( { model
                | highlightedDataPoint = Just highlightedDataPoint
                , sliderValue = touchPos
              }
            , Cmd.none
            )

        RemoveHighlight ->
            ( model |> removeHighlight, Cmd.none )



--View


plotView : PlotConfig msg -> Element msg
plotView config =
    el
        [ Element.centerX
        , Element.centerY
        ]
        (drawGraph config |> Element.html)


type alias PlotConfig msg =
    { model : Model
    , spread : Int
    , date : Date
    , dateRange : Range Date
    , msgChannel : Msg -> msg
    }


type alias Graph =
    List ( Float, Float )


type alias Range a =
    { min : a
    , max : a
    }


drawGraph : PlotConfig msg -> Html.Html msg
drawGraph config =
    let
        model =
            config.model

        betDate =
            config.date |> Date.toRataDie

        function =
            Function.calculateFunction
                config.spread
                config.date
                { startOfBet = model.startOfBet
                , endOfBet = model.endOfBet
                }

        dateRange =
            { min = config.dateRange.min |> Date.toRataDie
            , max = config.dateRange.max |> Date.toRataDie
            }

        maxPoints =
            (case dateRange.min < betDate && betDate < dateRange.max of
                True ->
                    [ dateRange.min, betDate, dateRange.max ]

                False ->
                    [ dateRange.min, dateRange.max ]
            )
                |> List.map function.mapping
                |> List.maximum
                |> Maybe.withDefault 0

        minPoints =
            (case dateRange.min < betDate && betDate < dateRange.max of
                True ->
                    [ dateRange.min, betDate, dateRange.max ]

                False ->
                    [ dateRange.min, dateRange.max ]
            )
                |> List.map function.mapping
                |> List.minimum
                |> Maybe.withDefault 0

        pointsRange =
            { min = 0
            , max = magnitude maxPoints
            }
    in
    svg
        [ model.plotWidth |> Round.round 2 |> width
        , model.plotHeight |> Round.round 2 |> height
        , [ 0, 0, model.plotWidth, model.plotHeight ]
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
         , yAxisLabel model Color.White
         , xAxis model Color.White
         , yAxis model Color.White
         , Svg.Lazy.lazy3 graphToSvg
            model
            { xRange = dateRange
            , yRange = pointsRange
            , radius = 2
            , color = Color.White
            , action = Nothing
            }
            function.graph
         ]
            ++ pointsTick model pointsRange maxPoints
            ++ pointsTick model pointsRange minPoints
            ++ yearTicks model dateRange
            ++ highlights model dateRange pointsRange function.mapping
            ++ [ clickFrame model (RemoveHighlight |> config.msgChannel) ]
            ++ touchBar
                model
                (TouchOnXAxis dateRange >> config.msgChannel)
        )



--Svg Functions


xAxis : Model -> Color -> Svg msg
xAxis model color =
    line
        [ 0 |> xAxisToCord model |> xCordToString model |> x1
        , 0 |> yAxisToCord model |> yCordToString model |> y1
        , 1 |> xAxisToCord model |> xCordToString model |> x2
        , 0 |> yAxisToCord model |> yCordToString model |> y2
        , color |> Color.toString |> stroke
        , "url(#triangle)" |> markerEnd
        ]
        []


yAxis : Model -> Color -> Svg msg
yAxis model color =
    line
        [ 0 |> xAxisToCord model |> xCordToString model |> x1
        , 0 |> yAxisToCord model |> yCordToString model |> y1
        , 0 |> xAxisToCord model |> xCordToString model |> x2
        , 1 |> yAxisToCord model |> yCordToString model |> y2
        , color |> Color.toString |> stroke
        , "url(#triangle)" |> markerEnd
        ]
        []


yAxisLabel : Model -> Color -> Svg msg
yAxisLabel model color =
    text_
        [ 0 |> xAxisToCord model |> xCordToString model |> x
        , 1 |> yAxisToCord model |> (+) 20 |> yCordToString model |> y
        , Color.White |> Color.toString |> fill
        , "middle" |> textAnchor
        , "middle" |> dominantBaseline
        ]
        [ "points" |> text ]


dateTick : Model -> Range Int -> Int -> List (Svg msg)
dateTick model range date =
    let
        xCord =
            dateToCord model range date

        yCord =
            yAxisToCord model 0
    in
    [ line
        [ xCord |> xCordToString model |> x1
        , yCord - 5 |> yCordToString model |> y1
        , xCord |> xCordToString model |> x2
        , yCord + 5 |> yCordToString model |> y2
        , Color.White |> Color.toString |> stroke
        , "2" |> strokeWidth
        ]
        []
    , text_
        [ xCord |> xCordToString model |> x
        , yCord - 20 |> yCordToString model |> y
        , "0" |> rotate
        , Color.White |> Color.toString |> fill
        , "middle" |> textAnchor
        , "middle" |> dominantBaseline
        ]
        [ date
            |> Date.fromRataDie
            |> Date.format "MMM ddd"
            |> text
        ]
    ]


yearTicks : Model -> Range Int -> List (Svg msg)
yearTicks model range =
    let
        startYear =
            range.min - 1 |> Date.fromRataDie |> Date.year

        endYear =
            range.max + 1 |> Date.fromRataDie |> Date.year
    in
    List.range startYear endYear
        |> List.map
            (\y -> Date.fromOrdinalDate y 1)
        |> List.filter (Date.isBetween (Date.fromRataDie (range.min - 1)) (Date.fromRataDie (range.max + 1)))
        |> List.map
            (Date.toRataDie
                >> dateToCord model range
            )
        |> List.map
            (\xc ->
                line
                    [ xc |> xCordToString model |> x1
                    , 0 |> yAxisToCord model |> yCordToString model |> y1
                    , xc |> xCordToString model |> x2
                    , 0 |> yAxisToCord model |> (\yc -> yc - 4) |> yCordToString model |> y2
                    , Color.White |> Color.toString |> stroke
                    , "2" |> strokeWidth
                    ]
                    []
            )


pointsTick : Model -> Range Float -> Float -> List (Svg msg)
pointsTick model range points =
    let
        yCord =
            pointsToCord model range points

        xCord =
            xAxisToCord model 0
    in
    [ line
        [ xCord - 5 |> xCordToString model |> x1
        , yCord |> yCordToString model |> y1
        , xCord + 5 |> xCordToString model |> x2
        , yCord |> yCordToString model |> y2
        , Color.White |> Color.toString |> stroke
        , "2" |> strokeWidth
        ]
        []
    , text_
        [ yCord |> yCordToString model |> y
        , xCord - 7 |> Round.round 2 |> x
        , Color.White |> Color.toString |> fill
        , "end" |> textAnchor
        , "middle" |> dominantBaseline
        ]
        [ points |> magnitudeRound |> text
        ]
    ]


highlights : Model -> Range Int -> Range Float -> (Int -> Float) -> List (Svg msg)
highlights model dateRange pointsRange mapping =
    case model.highlightedDataPoint of
        Nothing ->
            []

        Just date ->
            case dateRange.min <= date && date <= dateRange.max of
                False ->
                    []

                True ->
                    let
                        yCord =
                            pointsToCord model pointsRange (mapping date)

                        yBase =
                            yAxisToCord model 0

                        xCord =
                            dateToCord model dateRange date

                        xBase =
                            xAxisToCord model 0
                    in
                    List.concat
                        [ [ rect
                                [ xBase |> (+) -50 |> xCordToString model |> x
                                , yCord |> (+) 10 |> yCordToString model |> y
                                , "45" |> width
                                , "20" |> height
                                , Color.Black
                                    |> Color.toString
                                    |> (\s -> s ++ "99" |> fill)
                                ]
                                []
                          , line
                                [ xCord |> xCordToString model |> x1
                                , yBase |> yCordToString model |> y1
                                , xCord |> xCordToString model |> x2
                                , yCord |> yCordToString model |> y2
                                , Color.VeryGray |> Color.toString |> stroke
                                , "1" |> strokeWidth
                                ]
                                []
                          , line
                                [ xBase |> xCordToString model |> x1
                                , yCord |> yCordToString model |> y1
                                , xCord |> xCordToString model |> x2
                                , yCord |> yCordToString model |> y2
                                , Color.VeryGray |> Color.toString |> stroke
                                , "1" |> strokeWidth
                                ]
                                []
                          ]
                        , pointsTick
                            model
                            pointsRange
                            (mapping date)
                        , dateTick
                            model
                            dateRange
                            date
                        ]


graphToSvg :
    Model
    ->
        { xRange : Range Int
        , yRange : Range Float
        , radius : Int
        , color : Color
        , action : Maybe (Int -> msg)
        }
    -> List ( Int, Float )
    -> Svg msg
graphToSvg model config graph =
    let
        dateToString =
            dateToCord model config.xRange
                >> xCordToString model

        pointsToString =
            pointsToCord model config.yRange
                >> yCordToString model

        makeDot : ( Int, Float ) -> Svg msg
        makeDot ( date, points ) =
            circle
                ([ date |> dateToString |> cx
                 , points |> pointsToString |> cy
                 , config.radius |> String.fromInt |> r
                 , config.color |> Color.toString |> fill
                 ]
                    ++ (case config.action of
                            Just action ->
                                [ action date |> onClick ]

                            Nothing ->
                                []
                       )
                )
                []
    in
    g []
        (graph
            |> List.filter (\( x, y ) -> inRange config.xRange x)
            |> List.map
                makeDot
        )


touchBar : Model -> (Float -> msg) -> List (Svg msg)
touchBar model onChange =
    let
        touchBarHeight =
            30

        xLeftCord =
            xAxisToCord model 0 + model.paddingGraph.right

        xRightCord =
            xAxisToCord model 1 - model.paddingGraph.left

        yCord =
            0 |> yAxisToCord model
    in
    [ line
        [ xLeftCord |> xCordToString model |> x1
        , yCord |> yCordToString model |> y1
        , xRightCord |> xCordToString model |> x2
        , yCord |> yCordToString model |> y2
        , Color.NeonFuschia |> Color.toString |> stroke
        , "2" |> width
        , "3" |> strokeWidth
        ]
        []
    , foreignObject
        [ xLeftCord |> xCordToString model |> x
        , yCord + 15 |> yCordToString model |> y
        , xRightCord - xLeftCord |> Round.round 2 |> width
        , touchBarHeight |> Round.round 2 |> height
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
                [ Element.height Element.fill
                , Element.width Element.fill
                , 0 |> Element.padding

                {- centerY
                   , touchBarHeight
                       |> Element.px
                       |> Element.height
                -}
                {- , Color.NeonBlue
                       |> Color.translate
                       |> Border.color
                   , 1 |> Border.width
                -}
                ]
                { onChange = onChange
                , label =
                    Input.labelHidden
                        "My Slider Value"
                , min = 0
                , max = 1000
                , step = Nothing
                , value = model.sliderValue
                , thumb = Input.thumb [ 0 |> Element.px |> Element.width ] --removes thumb offset
                }
            )
        ]
    ]


clickFrame : Model -> msg -> Svg msg
clickFrame model event =
    rect
        [ "0" |> x
        , "0" |> y
        , model.plotWidth |> Round.round 2 |> width
        , model.plotHeight |> Round.round 2 |> height
        , event |> onClick
        , Color.White |> Color.toString |> (\s -> s ++ "00") |> fill
        ]
        []



-- Coordinate Translations and Positions


xCordToString : Model -> Float -> String
xCordToString model xCord =
    Round.round 2 xCord


yCordToString : Model -> Float -> String
yCordToString model yCord =
    model.plotHeight - yCord |> Round.round 2


xAxisToCord : Model -> Float -> Float
xAxisToCord model pos =
    linearTransform
        { min = model.paddingAxis.left
        , max = model.plotWidth - model.paddingAxis.right
        }
        { min = 0.0, max = 1 }
        pos


yAxisToCord : Model -> Float -> Float
yAxisToCord model pos =
    linearTransform
        { min = model.paddingAxis.bottom
        , max = model.plotHeight - model.paddingAxis.top
        }
        { min = 0.0, max = 1 }
        pos


dateToCord : Model -> Range Int -> Int -> Float
dateToCord model range date =
    linearTransform
        { min = 0 + model.paddingAxis.left + model.paddingGraph.left
        , max = model.plotWidth - model.paddingAxis.right - model.paddingGraph.right
        }
        { min = toFloat range.min
        , max = toFloat range.max
        }
        (toFloat date)


pointsToCord : Model -> Range Float -> Float -> Float
pointsToCord model range points =
    linearTransform
        { min = 0 + model.paddingAxis.bottom + model.paddingGraph.bottom
        , max = model.plotHeight - model.paddingAxis.top - model.paddingGraph.top
        }
        { min = range.min
        , max = range.max
        }
        points


linearTransform : { min : Float, max : Float } -> { min : Float, max : Float } -> Float -> Float
linearTransform rng dom x =
    ((dom.max - x) * rng.min + (x - dom.min) * rng.max) / (dom.max - dom.min)



-- helper


inRange : Range comparable -> comparable -> Bool
inRange range x =
    range.min <= x && x <= range.max


magnitude : Float -> Float
magnitude float =
    if float > 1001 then
        float

    else if float > 300 then
        1000

    else if float > 200 then
        300

    else if float > 100 then
        200

    else if float > 50 then
        100

    else if float > 10 then
        50

    else if float > 2 then
        10

    else
        5


magnitudeRound : Float -> String
magnitudeRound float =
    float
        |> (if float >= 1000 then
                String.fromFloat

            else if float > 100 then
                Round.round 1

            else if float > 10 then
                Round.round 2

            else if float > 1 then
                Round.round 3

            else if float > 0.00009 then
                Round.round 4

            else
                always "0"
           )
