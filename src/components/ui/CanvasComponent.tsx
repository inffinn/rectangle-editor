import * as React from "react";
import Canvas from '../classes/Canvas';

//компонент для отображения полотна и его инициализации
interface ICanvasComponentProps {
    canvas: Canvas;
}

class CanvasComponent extends React.Component<ICanvasComponentProps> {
    constructor(props: ICanvasComponentProps) {
        super(props);
    }

    componentDidMount() {
        this.props.canvas.init(document.getElementById("canvas") as HTMLCanvasElement);

    }

    render() {
        return <div className="canvasComponent">
            <canvas id='canvas'>canvas</canvas>
        </div>
    }
}

export default CanvasComponent;