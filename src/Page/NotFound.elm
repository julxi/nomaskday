module Page.NotFound exposing (..)

import Element exposing (Element)
import Element.Font as Font
import Logic.Logic exposing (..)
import Ui.Palette.Color as Color


view : Model -> Element Msg
view model =
    Element.el [ Color.White |> Color.translate |> Font.color ]
        (Element.text "notfound")
