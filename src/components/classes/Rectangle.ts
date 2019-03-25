import {IPoint, IRectangle} from "../../Interfaces/Interfaces";

export default class Rectangle implements IRectangle { //класс пр-ка

    private _points: Array<IPoint> = [];
    private _height: number;
    private _width: number;
    private _canvas: CanvasRenderingContext2D;
    private _color: string;
    private _lineWidth: number = 2;

    public get points(): Array<IPoint> {
        return this._points;
    }

    constructor(canvas: CanvasRenderingContext2D, {x, y}: IPoint, size: number, color: string) {
        this._height = size;
        this._width = this._height * 2;//соотношение сторон 2к1
        this._points = [];
        this._points[0] = {x, y}; //координаты относительно курсора
        this._points[1] = {x, y: y + this._height};
        this._points[2] = {x: x + this._width, y: y + this._height};
        this._points[3] = {x: x + this._width, y};
        this._canvas = canvas;//2д контекст полотна
        this._color = color;
    }

    //расчет новых координат относительно указанной точки
    public getPointsInPosition({x, y}: IPoint): Array<IPoint> {
        const nextPoints: Array<IPoint> = [];
        let newPoint: IPoint = {
            x: x - this._width / 2, //центр пря-ка переместить в положение курсора
            y: y - this._height / 2
        }
        nextPoints[0] = newPoint;
        nextPoints[1] = {x: newPoint.x, y: newPoint.y + this._height};
        nextPoints[2] = {x: newPoint.x + this._width, y: newPoint.y + this._height};
        nextPoints[3] = {x: newPoint.x + this._width, y: newPoint.y};
        return nextPoints;

    }

//получить локальные координаты относительно прямоугольника
    public getLocalPosition(point: IPoint): IPoint {
        const localCoords: IPoint = {
            x: point.x - this._points[0].x,
            y: point.y - this._points[0].y
        };
        return localCoords
    }

//перезапись текущих координат
    public move({x, y}: IPoint): void {
        x = x - this._width / 2; //центр пря-ка переместить в положение курсора
        y = y - this._height / 2;
        this._points[0] = {x, y};
        this._points[1] = {x, y: y + this._height};
        this._points[2] = {x: x + this._width, y: y + this._height};
        this._points[3] = {x: x + this._width, y};
    }

    //отрисовка
    public render(isHighlight?: boolean): void {
        this._canvas.lineWidth = this._lineWidth;
        this._canvas.fillStyle = this._color;
        this._canvas.fillRect(this._points[0].x, this._points[0].y, this._width, this._height);
        if (isHighlight) {
            this._canvas.strokeRect(this._points[0].x, this._points[0].y, this._width, this._height);
        }
    }
}
