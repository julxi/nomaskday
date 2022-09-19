module DatePicker.DatePicker exposing (..)

{-|


# Basic Usage

@docs input, Model, init, setToday, ChangeEvent, update, Settings, defaultSettings, initWithToday


# Helpers

For when you want to be more in control

@docs close, open, setVisibleMonth

-}

import Date exposing (Date)
import DatePicker.Internal.Date as Date
import DatePicker.Internal.TestHelper as TestHelper
import DatePicker.Internal.Week as Week exposing (Week)
import Element exposing (Attribute, Element, alignLeft, alignRight, centerX, centerY, padding, spacing)
import Element.Background as Background
import Element.Border as Border
import Element.Events as Events
import Element.Font as Font
import Element.Input as Input
import Html.Events
import Json.Decode as Decode
import Time exposing (Month(..), Weekday(..))



-- MODEL


type Model
    = Model Picker


type alias Picker =
    { today : Date
    , visibleMonth : Date
    }


toPicker : Model -> Picker
toPicker (Model picker) =
    picker


init : Model
init =
    Model
        { today = Date.fromOrdinalDate 1 1
        , visibleMonth = Date.fromOrdinalDate 1 1
        }


{-| The initial model of the date picker and sets the given date as today.
-}
initWithToday : Date -> Model
initWithToday today =
    Model
        { today = today
        , visibleMonth = today
        }


{-| Sets the day that should be marked as today.
-}
setToday : Date -> Model -> Model
setToday today (Model picker) =
    Model { picker | today = today, visibleMonth = today }


getToday : Model -> Date
getToday (Model picker) =
    picker.today


{-| Sets the current visible month of the date picker.
-}
setVisibleMonth : Date -> Model -> Model
setVisibleMonth date (Model picker) =
    Model { picker | visibleMonth = date }


getVisibleMonth : Model -> Date
getVisibleMonth (Model picker) =
    picker.visibleMonth



--updateVisibleMonth : Date -> Model -> Model
--updateVisibleMonth date (Model picker) =
--  UPDATE


type Msg
    = ChangeMonth Date
    | NothingToDo


type ChangeEvent
    = DateChanged Date
    | PickerChanged Msg


{-| -}
update : Msg -> Model -> Model
update msg (Model picker) =
    case msg of
        ChangeMonth month ->
            Model { picker | visibleMonth = month }

        NothingToDo ->
            Model picker



-- VIEW


{-| -}
type alias Settings =
    { firstDayOfWeek : Weekday
    , language : Maybe Language
    , disabled : Date -> Bool
    , pickerAttributes : List (Attribute Never)
    , headerAttributes : List (Attribute Never)
    , tableAttributes : List (Attribute Never)
    , weekdayAttributes : List (Attribute Never)
    , dayAttributes : List (Attribute Never)
    , wrongMonthDayAttributes : List (Attribute Never)
    , todayDayAttributes : List (Attribute Never)
    , selectedDayAttributes : List (Attribute Never)
    , disabledDayAttributes : List (Attribute Never)
    , previousMonthElement : Element Never
    , nextMonthElement : Element Never
    }


{-| Reasonable default settings.
-}
defaultSettings : Settings
defaultSettings =
    { firstDayOfWeek = Mon
    , language = Nothing
    , disabled = always False
    , pickerAttributes =
        [ Border.width 1
        , Border.color (Element.rgb255 186 189 182)
        , Border.roundEach
            { topLeft = 0
            , topRight = 0
            , bottomLeft = 3
            , bottomRight = 3
            }
        , Element.moveDown 3
        , padding 8
        , spacing 4
        , Background.color <| Element.rgb255 255 255 255
        ]
    , headerAttributes =
        [ Element.width Element.fill
        , padding 8
        , Font.bold
        ]
    , tableAttributes = [ spacing 4, centerX, centerY ]
    , weekdayAttributes = [ Font.bold ]
    , dayAttributes =
        [ Element.paddingXY 4 2
        , Border.rounded 3
        , Element.mouseOver [ Background.color (Element.rgb255 0x73 0xB6 0xFF) ]
        ]
    , wrongMonthDayAttributes =
        [ Font.color (Element.rgb255 0x80 0x80 0x80) ]
    , todayDayAttributes =
        [ Background.color (Element.rgb255 0xFF 0xC1 0x9B) ]
    , selectedDayAttributes =
        [ Background.color (Element.rgb255 0x00 0x7B 0xFF) ]
    , disabledDayAttributes =
        [ Font.color (Element.rgb255 0x80 0x80 0x80)
        , Background.color (Element.rgb255 0xDD 0xDD 0xDD)
        ]
    , previousMonthElement =
        Element.text "◄"
    , nextMonthElement =
        Element.text "►"
    }


{-| Alias of [`Language`][dateLanguage] from `justinmimbs/date`.
[dateLanguage]: <https://package.elm-lang.org/packages/justinmimbs/date/latest/Date#Language>
-}
type alias Language =
    Date.Language


type alias Config msg =
    { settings : Settings
    , picker : Picker
    , selected : Maybe Date
    , onChange : ChangeEvent -> msg
    }


pickerView :
    Config msg
    -> Element msg
pickerView ({ settings } as config) =
    Element.column
        (TestHelper.calendarAttr
            :: preventDefaultOnMouseDown config
            :: extAttrs settings.pickerAttributes
        )
        [ pickerHeader config
        , pickerTable config
        ]


pickerTable : Config msg -> Element msg
pickerTable ({ settings } as config) =
    Element.table (TestHelper.tableAttr :: extAttrs settings.tableAttributes)
        { data = Week.weeksInMonth config.picker.visibleMonth config.settings.firstDayOfWeek
        , columns = pickerColumns config
        }


pickerColumns : Config msg -> List (Element.Column (Week Date) msg)
pickerColumns config =
    let
        weekdays =
            Week.calendarWeekDays config.settings.firstDayOfWeek config.settings.language

        toColumn index weekday =
            { header = Element.el (extAttrs config.settings.weekdayAttributes) (Element.text weekday)
            , width = Element.fill
            , view =
                \week ->
                    Week.getDay index week
                        |> dayView config
            }
    in
    Week.toList (Week.indexedMap toColumn weekdays)


pickerHeader : Config msg -> Element msg
pickerHeader { picker, onChange, settings } =
    Element.row (extAttrs settings.headerAttributes)
        [ Element.el
            [ alignLeft
            , Element.pointer
            , Events.onClick <|
                onChange <|
                    PickerChanged <|
                        ChangeMonth (Date.add Date.Months -1 picker.visibleMonth)
            , TestHelper.previousMonthAttr
            ]
          <|
            extEle settings.previousMonthElement
        , Element.el [ centerX ] <|
            Element.text <|
                Date.formatMaybeLanguage settings.language "MMMM yyyy" picker.visibleMonth
        , Element.el
            [ alignRight
            , Element.pointer
            , Events.onClick <|
                onChange <|
                    PickerChanged <|
                        ChangeMonth (Date.add Date.Months 1 picker.visibleMonth)
            , TestHelper.nextMonthAttr
            ]
          <|
            extEle settings.nextMonthElement
        ]


dayView : Config msg -> Date -> Element msg
dayView ({ picker, settings } as config) day =
    let
        attributesForThisDay =
            List.concat
                [ extAttrs settings.dayAttributes
                , if Date.month config.picker.visibleMonth /= Date.month day then
                    extAttrs settings.wrongMonthDayAttributes

                  else
                    [ TestHelper.dayInMonthAttr ]
                , if picker.today == day then
                    TestHelper.todayAttr
                        :: extAttrs settings.todayDayAttributes

                  else
                    []
                , if config.selected == Just day then
                    TestHelper.selectedAttr
                        :: extAttrs settings.selectedDayAttributes

                  else
                    []
                , if settings.disabled day then
                    extAttrs settings.disabledDayAttributes

                  else
                    [ Events.onClick <| config.onChange <| DateChanged day, Element.pointer ]
                ]
    in
    Element.el attributesForThisDay
        (Element.el
            [ centerX, centerY ]
            (Element.text <| Date.formatMaybeLanguage settings.language "dd" day)
        )



-- ADDITIONAL HELPERS


extAttrs : List (Attribute Never) -> List (Attribute a)
extAttrs =
    List.map (Element.mapAttribute never)


extEle : Element Never -> Element a
extEle =
    Element.map never


{-| This is used, to prevent that the picker is closed unexpectedly.
-}
preventDefaultOnMouseDown : Config msg -> Attribute msg
preventDefaultOnMouseDown config =
    Element.htmlAttribute <|
        Html.Events.preventDefaultOn "mousedown" <|
            Decode.succeed ( config.onChange <| PickerChanged NothingToDo, True )
