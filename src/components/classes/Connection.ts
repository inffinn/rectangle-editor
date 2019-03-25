import {IConnection, IPoint} from "../../Interfaces/Interfaces";
import Rectangle from "./Rectangle";

export default class Connection implements IConnection {//класс связи
    private _canvas: CanvasRenderingContext2D;
    private _localStartPoint: IPoint;
    private _localEndPoint: IPoint;
    private _globalStartPoint: IPoint;
    private _globalEndPoint: IPoint;
    private _startRectangle: Rectangle;
    private _endRectangle: Rectangle;
    private _lineWidth: number = 2;

    constructor(canvas: CanvasRenderingContext2D, startPoint: IPoint) {
        this._canvas = canvas;
        this._localStartPoint = {x: startPoint.x, y: startPoint.y};
        this._localEndPoint = {x: startPoint.x, y: startPoint.y};
    }

    public connectStartRectangle(rectangle: Rectangle, localCoords: IPoint): void { //сохранение прям-ка и локальных координат относительно него
        this._startRectangle = rectangle;
        this._localStartPoint = localCoords;
    }

    public connectEndRectangle(rectangle: Rectangle, localCoords: IPoint): void {//сохранение прям-ка и локальных координат относительно него
        this._endRectangle = rectangle;
        this._localEndPoint = localCoords;
    }

//перезапись конечной точки
    public move(endPoint: IPoint): void {
        this._localEndPoint = endPoint;
    }

    get startPoint(): IPoint {
        return this._globalStartPoint;
    }

    get endPoint(): IPoint {
        return this._globalEndPoint;
    }

    // проверка, установлена ли связь между прям-ми
    public isCheckConnection() {
        return (
            this._startRectangle && this._endRectangle &&
            this._startRectangle != this._endRectangle
        ) //если есть начальный и конечный прям-к и они не равны
    }

//получение глобальных координат и их отрисовка
    //если есть начальный и конечный прям-к, то лок. коорд относительно прям-ка преобр. в глобальные
    public render(isHighlight?: boolean): void {
        isHighlight ? this._lineWidth = 3 : this._lineWidth = 2;
        this._canvas.lineWidth = this._lineWidth;
        this._startRectangle ?
            this._globalStartPoint = {
                x: this._localStartPoint.x + this._startRectangle.points[0].x,
                y: this._localStartPoint.y + this._startRectangle.points[0].y
            } : this._globalStartPoint = this._localStartPoint;

        this._endRectangle ?
            this._globalEndPoint = {
                x: this._localEndPoint.x + this._endRectangle.points[0].x,
                y: this._localEndPoint.y + this._endRectangle.points[0].y
            } : this._globalEndPoint = this._localEndPoint;

        //отрисовка
        this._canvas.beginPath();
        this._canvas.moveTo(this._globalStartPoint.x, this._globalStartPoint.y);
        this._canvas.lineTo(this._globalEndPoint.x, this._globalEndPoint.y);
        this._canvas.stroke();
    }
}