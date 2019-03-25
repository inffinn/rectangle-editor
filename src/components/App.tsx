import * as React from "react";
import '../../css/App.scss';
import {render} from 'react-dom';
import ToolBar from './ui/ToolBar'
import InfoWindow from './ui/InfoWindow'
import CanvasComponent from "./ui/CanvasComponent";
import Canvas from './classes/Canvas'

const canvas: Canvas = new Canvas();

const Main_page = () => (
    <div className="mainPage">
        <InfoWindow/>
        <ToolBar canvas={canvas}/>
        <CanvasComponent canvas={canvas}/>
    </div>
)

render(
    <Main_page/>,
    document.getElementById('app')
)
