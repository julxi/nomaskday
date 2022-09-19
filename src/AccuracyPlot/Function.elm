module AccuracyPlot.Function exposing (..)

import Date exposing (Date)


type alias Function =
    { graph : List ( Int, Float )
    , mapping : Int -> Float
    }


calculateFunction : Int -> Date -> { startOfBet : Int, endOfBet : Int } -> Function
calculateFunction spread date model =
    let
        allDays =
            List.range model.startOfBet model.endOfBet

        totalPoints =
            1000

        s =
            spread

        d =
            Date.toRataDie date
    in
    if s <= 0 then
        let
            f d2 =
                if d2 == d then
                    totalPoints

                else
                    0
        in
        { graph = allDays |> List.map (\d2 -> ( d2, f d2 ))
        , mapping = f
        }

    else if s >= 100 then
        let
            f d2 =
                totalPoints / toFloat (model.endOfBet - model.startOfBet)
        in
        { graph = allDays |> List.map (\d2 -> ( d2, f d2 ))
        , mapping = f
        }

    else
        let
            logS =
                -(logBase e (toFloat s / 100)) / 5

            f_0 d_ =
                e ^ -((toFloat (d - d_) * logS) ^ 2)
        in
        calculateFunctionRecursively f_0 model.startOfBet model.endOfBet



{- graph_0 =
           allDays |> List.map (\d_ -> ( d_, f_0 d_ ))

       normalizer =
           List.foldl (\( d_, v ) sm -> v + sm) 0 graph_0 / 1000
   in
   { graph = graph_0 |> List.map (\( d_, v ) -> ( d_, v / normalizer ))
   , mapping =
       \d_ -> f_0 d_ / normalizer
   }
-}


calculateFunctionRecursively : (Int -> Float) -> Int -> Int -> Function
calculateFunctionRecursively fun start goal =
    let
        recConstruct :
            { graph : List ( Int, Float )
            , sum : Float
            , next : Int
            }
            ->
                { graph : List ( Int, Float )
                , sum : Float
                , next : Int
                }
        recConstruct step =
            let
                this =
                    step.next

                thisValue =
                    fun this
            in
            case this <= goal of
                True ->
                    recConstruct
                        { graph = ( this, thisValue ) :: step.graph
                        , sum = step.sum + thisValue
                        , next = this + 1
                        }

                False ->
                    step

        preComputation =
            recConstruct { graph = [], sum = 0, next = start }

        normalizer =
            preComputation.sum / 1000
    in
    { graph = preComputation.graph |> List.map (\( d, v ) -> ( d, v / normalizer ))
    , mapping = \d -> fun d / normalizer
    }
