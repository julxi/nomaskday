module Main exposing (..)

import Api exposing (ApiResponse(..))
import Browser exposing (Document, application)
import Browser.Dom
import Browser.Events
import Browser.Navigation exposing (Key)
import DatePicker
import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Font as Font
import Element.Input as Input
import Html exposing (Html)
import Http exposing (Error(..))
import Json.Decode as Decode exposing (Decoder)
import Page exposing (Problem(..))
import Palette.Color as Color
import Palette.Distance as Distance
import Palette.FontSize as FontSize
import Problem exposing (Problem)
import RegistrationTest
import Task
import UiElements
import Url exposing (Url)
import Url.Parser
import Url.Parser.Query
import User exposing (User)
import User.Member as Member exposing (Member)
import User.Member.Passcode as Passcode



-- Model


type Model
    = Loading Infos -- Very first screen. Needed for decoding the passcode
    | LoadingWithProblem Problem -- Do I need this pure problem Srceen?
    | LoadedPage Page.Model -- First main screen


type alias Infos =
    { key : Key
    , maybePasscode : Maybe Passcode.Passcode
    , width : Float
    , height : Float
    }



-- Init


init : () -> Url -> Key -> ( Model, Cmd Msg )
init _ url key =
    let
        infos =
            { key = key
            , maybePasscode = Passcode.fromUrl url
            , width = 0
            , height = 0
            }

        maybePasscode =
            Passcode.fromUrl url
    in
    case maybePasscode of
        Just passcode ->
            ( Loading infos, Api.login ProcessLogin passcode )

        Nothing ->
            ( LoadedPage (Page.init key), Cmd.none )



-- View


view : Model -> Document Msg
view model =
    let
        title =
            "No-Mask-Day-Bet"

        body =
            case model of
                Loading infos ->
                    Element.layout []
                        (text <|
                            String.join
                                " "
                                [ "Loading....."
                                , " Width:"
                                , String.fromFloat infos.width
                                , " Heigth: "
                                , String.fromFloat infos.height
                                ]
                        )

                LoadingWithProblem problem ->
                    Element.layout [] (text "Problem")

                LoadedPage loadedModel ->
                    Element.layout
                        []
                        (Element.map
                            PageMsg
                            (Page.view loadedModel)
                        )
    in
    { title = title, body = [ body ] }



-- Update


type Msg
    = NoOp
    | TestMessage (Result Http.Error String)
    | ProcessLogin (Result Http.Error (ApiResponse Member))
    | PageMsg Page.Msg
    | SaveScreenSize Browser.Dom.Viewport


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    let
        todo =
            ( model, Cmd.none )
    in
    case ( msg, model ) of
        ( ProcessLogin result, Loading infos ) ->
            case result of
                Ok loginResponse ->
                    case loginResponse of
                        Success member ->
                            ( LoadedPage (Page.initWithMember infos.key member)
                            , Cmd.none
                            )

                        Failure issues ->
                            issues
                                |> Unspecified
                                |> Page.initWithProblem infos.key
                                |> LoadedPage
                                |> noCmd

                        ApiError method errors ->
                            errors
                                |> Unspecified
                                |> Page.initWithProblem infos.key
                                |> LoadedPage
                                |> noCmd

                        ResponseError method errors ->
                            errors
                                |> Unspecified
                                |> Page.initWithProblem infos.key
                                |> LoadedPage
                                |> noCmd

                Err httpError ->
                    case httpError of
                        BadUrl badUrl ->
                            [ "invalidUrl on Login-request: " ++ badUrl ]
                                |> Unspecified
                                |> Page.initWithProblem infos.key
                                |> LoadedPage
                                |> noCmd

                        Timeout ->
                            [ "Timeout on Login-request" ]
                                |> Unspecified
                                |> Page.initWithProblem infos.key
                                |> LoadedPage
                                |> noCmd

                        NetworkError ->
                            [ "NetworkError on Login-request" ]
                                |> Unspecified
                                |> Page.initWithProblem infos.key
                                |> LoadedPage
                                |> noCmd

                        BadStatus badStatus ->
                            [ "BadStatus on Login-request: " ++ String.fromInt badStatus ]
                                |> Unspecified
                                |> Page.initWithProblem infos.key
                                |> LoadedPage
                                |> noCmd

                        BadBody badBody ->
                            [ "BadBody on Login-request: " ++ badBody ]
                                |> Unspecified
                                |> Page.initWithProblem infos.key
                                |> LoadedPage
                                |> noCmd

        ( SaveScreenSize viewport, Loading infos ) ->
            Loading
                { infos
                    | width = viewport.viewport.width
                    , height = viewport.viewport.height
                }
                |> noCmd

        ( PageMsg subMsg, LoadedPage subModel ) ->
            Page.update subMsg subModel
                |> updateWith LoadedPage PageMsg model

        ( NoOp, _ ) ->
            ( model, Cmd.none )

        ( _, _ ) ->
            -- Disregard messages that arrived for the wrong page.
            ( model, Cmd.none )


noCmd : a -> ( a, Cmd msg )
noCmd a =
    ( a, Cmd.none )


updateWith : (subModel -> Model) -> (subMsg -> Msg) -> Model -> ( subModel, Cmd subMsg ) -> ( Model, Cmd Msg )
updateWith toModel toMsg model ( subModel, subCmd ) =
    ( toModel subModel
    , Cmd.map toMsg subCmd
    )



-- Subscriptions


subscriptions : Model -> Sub Msg
subscriptions model =
    --Browser.Events.onResize (\_ _ -> PlotMsg AccuracyPlot.NewPlotWidth)
    Browser.Events.onResize (\_ _ -> NoOp)



-- Main


main =
    application
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        , onUrlRequest = \request -> NoOp
        , onUrlChange = \url -> NoOp
        }
