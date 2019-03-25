import * as React from 'react';
import Canvas from '../classes/Canvas';

//компонент для отображения панели управления
interface IToolBarProps {
    canvas: Canvas;
}

interface IToolBarState {
    mode: string;
    rectangleSize: number;
}

class ToolBar extends React.Component<IToolBarProps, IToolBarState> {
    private static MOVE_RECTANGLE_IMG_PATH: string = "./assets/rectangle.svg";
    private static ADD_CONNECTION_IMG_PATH: string = "./assets/connection.svg";
    private static DELETE_CONNECTION_IMG_PATH: string = "./assets/delete.svg";
    private static MOVE_RECTANGLE_TITLE: string = "move rectangle";
    private static ADD_CONNECTION_TITLE: string = "add connection";
    private static DELETE_CONNECTION_TITLE: string = "delete connection";
    private static MOVE_RECTANGLE_CURSOR: string = "default";
    private static ADD_CONNECTION_CURSOR: string = "crosshair";
    private static DELETE_CONNECTION_CURSOR: string = "not-allowed";
    private _defaultRectangleSize: number = 50;

    constructor(props: IToolBarProps) {
        super(props);
        this.state = {
            mode: props.canvas.mode, rectangleSize: props.canvas.rectangleSize
        };
        props.canvas.onModeChange((mode: string) => this.setState({mode}));
        props.canvas.onRectangleSizeChange((rectangleSize: number) => this.setState({rectangleSize}));
    }

    ComponentDidMount() {
        this.props.canvas.rectangleSize = this._defaultRectangleSize;
    }

    private changeRectangleSize(e: React.ChangeEvent<HTMLInputElement>) {
        let value: number = parseInt(e.target.value);
        if (value < 20) {

            value = 20
        }
        if (value > 100) {
            value = 100;
        }
        if (isNaN(value)) {
            value = 50;
        }
        e.target.value = value.toString();
        this.props.canvas.rectangleSize = value;
    }

    changeMode = (cursor: string, mode: string): void => {
        document.body.style.cursor = cursor;
        this.props.canvas.mode = mode;
    }

    render() {

        let rectangle_button = this.state.mode == Canvas.MOVE_RECTANGLE ?
            <div className="pressedButton" title={ToolBar.MOVE_RECTANGLE_TITLE}
                 onClick={() => this.changeMode(ToolBar.MOVE_RECTANGLE_CURSOR, Canvas.MOVE_RECTANGLE)}
            ><img src={ToolBar.MOVE_RECTANGLE_IMG_PATH}/></div> :
            <div className="button" title={ToolBar.MOVE_RECTANGLE_TITLE}
                 onClick={() => this.changeMode(ToolBar.MOVE_RECTANGLE_CURSOR, Canvas.MOVE_RECTANGLE)}
            ><img src={ToolBar.MOVE_RECTANGLE_IMG_PATH}/></div>;

        let connection_button = this.state.mode == Canvas.ADD_CONNECTION ?
            <div className="pressedButton" title={ToolBar.ADD_CONNECTION_TITLE}
                 onClick={() => this.changeMode(ToolBar.ADD_CONNECTION_CURSOR, Canvas.ADD_CONNECTION)}
            ><img src={ToolBar.ADD_CONNECTION_IMG_PATH}/></div> :
            <div className="button" title={ToolBar.ADD_CONNECTION_TITLE}
                 onClick={() => this.changeMode(ToolBar.ADD_CONNECTION_CURSOR, Canvas.ADD_CONNECTION)}
            ><img src={ToolBar.ADD_CONNECTION_IMG_PATH}/></div>;

        let delete_button = this.state.mode == Canvas.DELETE_CONNECTION ?
            <div className="pressedButton" title={ToolBar.DELETE_CONNECTION_TITLE}
                 onClick={() => this.changeMode(ToolBar.DELETE_CONNECTION_CURSOR, Canvas.DELETE_CONNECTION)}
            ><img src={ToolBar.DELETE_CONNECTION_IMG_PATH}/></div> :
            <div className="button" title={ToolBar.DELETE_CONNECTION_TITLE}
                 onClick={() => this.changeMode(ToolBar.DELETE_CONNECTION_CURSOR, Canvas.DELETE_CONNECTION)}
            ><img src={ToolBar.DELETE_CONNECTION_IMG_PATH}/></div>;
        let size = <input className="size" type="Number" defaultValue={this._defaultRectangleSize.toString()}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.changeRectangleSize(e)}/>
        return <div className="toolBar">
            {rectangle_button}
            {connection_button}
            {delete_button}
            {size}
        </div>
    }
}

export default ToolBar;