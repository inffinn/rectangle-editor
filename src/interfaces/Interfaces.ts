import Rectangle from "../components/classes/Rectangle";

export interface ICanvas {

    mode: string;

    rectangleSize: number;

    onModeChange(fn: Function): void;

    onRectangleSizeChange(fn: Function): void;

    init(canvasElement: HTMLCanvasElement): void;
}

export interface IShape {

    move({x, y}: IPoint): void;

    render(): void;

}

export interface IRectangle extends IShape {

    getPointsInPosition(point:IPoint):Array<IPoint>;
    getLocalPosition(point:IPoint):IPoint;
    points:Array<IPoint>;

}

export interface IConnection extends IShape {

    connectStartRectangle(rectangle: Rectangle, localCoords: IPoint):void;
    connectEndRectangle(rectangle: Rectangle, localCoords: IPoint):void;
    isCheckConnection():boolean;
    startPoint:IPoint;
    endPoint:IPoint;

}

export interface IPoint {
    x: number,
    y: number
}