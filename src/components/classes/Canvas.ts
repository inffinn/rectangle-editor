import Connection from './Connection';
import {ICanvas, IPoint} from "../../Interfaces/Interfaces";
import Rectangle from "./Rectangle";
import ShapeUtils from "../utils/ShapeUtils";


export default class Canvas implements ICanvas {
    //класс, который работает с компонентом канвас
    public static MOVE_RECTANGLE: string = "move_rectangle";
    public static ADD_CONNECTION: string = "add_connection";
    public static DELETE_CONNECTION: string = "delete_connection";
    private _mode: string;
    private _size: number = 50; //рамзер прям-ка
    private _canvasElement: HTMLCanvasElement;
    private _canvas: CanvasRenderingContext2D;
    private _modeListeners: Array<Function> = []; //массив фукнций обработчиков событий наблюдателей для вызова при смене режима
    private _sizeListeners: Array<Function> = [];
    private _cursorPoint: IPoint = {x: 0, y: 0}; //координаты курсора относительно канвас
    private _fps: number = 50;//кол-во кадров в секнду
    private _speed: number = 1000 / this._fps;// задержка, с которой будет отрисовываться полотно
    private _rectangles: Array<Rectangle>;
    private _mouseIsDown = false;//зажата ли мышь
    private _indexOfTargetedRectangle: number = -1;// индекс захваченного пр-ка
    private _connections: Array<Connection>;//связи между  пр-ками для отрисовки
    private _tempConnection: Connection;//для отрисовки еще не существуеющей связи, при проверки условия на соед 2х пр-ков добавляется в массив связей

    constructor() {
        this._mode = Canvas.MOVE_RECTANGLE; //какая кнопка нажата-режим. Значения: 'move rectangle', 'add connection' или 'delete connection'
        this._size = 50; //рамзер прям-ка
        this._modeListeners = []; //массив фукнций наблюдателей для вызова при смене режима
        this._sizeListeners = [];//массив фукнций наблюдателей для вызова при смене размера прям-ка
        this._rectangles = [];
        this._fps = 50;//кол-во кадров в секнду
        this._speed = 1000 / this._fps;// задержка, с которой будет отрисовываться полотно
        this._mouseIsDown = false;//зажата ли мышь
        this._indexOfTargetedRectangle = -1;//захваченный индекс пр-ка
        this._connections = [];//связи между  пр-ками для отрисовки
        this._tempConnection;//для отрисовки еще не существуеющей связи, при проверки условия на соед 2х пр-ков добавляется в массив связей
    }

    public get mode(): string {
        return this._mode;
    }

    public get rectangleSize(): number {
        return this._size;
    }

    public set mode(value: string) {
        this._mode = value;
        this._modeListeners.map(fn => fn(this._mode));//оповестить наблюдателей
    }

    public set rectangleSize(size: number) {//сменить размер прям-ка
        this._size = size;
        this._sizeListeners.map(fn => fn(this._size));//оповестить наблюдателей
    }

    public onModeChange(fn: Function): void {//оповещение слушателей при смене режима
        this._modeListeners.push(fn);
    }

    public onRectangleSizeChange(fn: Function): void { //оповещение слушателей при смене размера прям-ка
        this._sizeListeners.push(fn);
    }

    private getRandomColor = (): string => { //генератор цвета
        const color = Math.floor(Math.random() * 16777216).toString(16);
        return '#000000'.slice(0, -color.length) + color;
    }

    private getCanvasPoints(): Array<IPoint> {
        const canvasPoints: Array<IPoint> = [
            {x: 0, y: 0},
            {x: 0, y: this._canvasElement.height},
            {
                x: this._canvasElement.width,
                y: this._canvasElement.height
            },
            {x: this._canvasElement.width, y: 0}
        ];
        return canvasPoints;
    }

    private resizeHandler = (): void => { //установка размеров полотна относительно родительского элемента при загрузке окна
        this._canvasElement.width = (this._canvasElement.parentNode as HTMLElement).clientWidth;
        this._canvasElement.height = (this._canvasElement.parentNode as HTMLElement).clientHeight;
    }

    private dblClickHandler = (): void => {
        const tempRectangle: Rectangle = new Rectangle(this._canvas, this._cursorPoint, this._size, this.getRandomColor());
        if (
            ShapeUtils.isRectangleCollided(this._rectangles, tempRectangle.points) ||// проверка, можно ли разместить прям-к
            ShapeUtils.isRectangleInArea(tempRectangle.points, this.getCanvasPoints())
        ) {
            alert('Cant place here!')
        } else {
            this._rectangles.push(tempRectangle);//иначе добавить пря-к в массив
        }
        window.getSelection().removeAllRanges();//снимает все выделения после даблклика
    };

    private mouseDownHandler = (): void => {//нажата кнопка мышки
        this._mouseIsDown = true;
        if (this._mode == Canvas.MOVE_RECTANGLE) {//если выбран режим
            this._indexOfTargetedRectangle = ShapeUtils.getRectangleIndexInPoint(this._rectangles, this._cursorPoint);//поиск индекса захваченного прям-ка, в котором коорд-ты курсора
        }

        if (this._mode == Canvas.ADD_CONNECTION) {
            this._tempConnection = new Connection(this._canvas, this._cursorPoint);//новая временная связь
            const rectangleIndex: number = ShapeUtils.getRectangleIndexInPoint(this._rectangles, this._cursorPoint);
            if (rectangleIndex >= 0) {
                const localCoords: IPoint = this._rectangles[rectangleIndex].getLocalPosition(this._cursorPoint);//находит локальные коорд-ты относительно начального прямоугольника, с которым устанавливается связь
                this._tempConnection.connectStartRectangle(this._rectangles[rectangleIndex], localCoords);//установка связи с прямоугольником
            }
        }
        if (this._mode == Canvas.DELETE_CONNECTION) {
            const index: number = ShapeUtils.getConnectionIndexInPoint(this._connections, this._cursorPoint);
            if (index >= 0)//удаляет выбранную связь
                this._connections.splice(index, 1);
        }
    }

    private mouseUpHandler = (): void => {//кнопка мышки отжата
        if (this._mouseIsDown) {
            this._mouseIsDown = false;
            if (this._mode == Canvas.ADD_CONNECTION) {//режим
                const rectangleIndex: number = ShapeUtils.getRectangleIndexInPoint(this._rectangles, this._cursorPoint);
                if (rectangleIndex >= 0) { //если найден прям-к
                    const localCoords = this._rectangles[rectangleIndex].getLocalPosition(this._cursorPoint);//поиск лок-льных коорд. относительно прям-ка
                    this._tempConnection.connectEndRectangle(this._rectangles[rectangleIndex], localCoords);//установка конечного связанного прям-ка
                    if (this._tempConnection.isCheckConnection()) { //если связь установлена корректно
                        this._connections.push(this._tempConnection); //связь заносится в массив связей
                    }
                }
            }
        }
        this._indexOfTargetedRectangle = -1; //сброс индекса захваченного прям-ка
        this._tempConnection = null;//иначе временная связь удаляется
    }

    private mouseMoveHandler = (e: MouseEvent): void => { //вычисление коор-т курсора относительно начала холста
        this._cursorPoint.x = e.offsetX;
        this._cursorPoint.y = e.offsetY;
    }

    private initHandlers(): void { //установка обработчиков
        window.addEventListener('load', this.resizeHandler);
        window.addEventListener('resize', this.resizeHandler);
        this._canvasElement.ondblclick = this.dblClickHandler;
        this._canvasElement.onmousedown = this.mouseDownHandler;
        this._canvasElement.onmouseup = this.mouseUpHandler;
        this._canvasElement.onmousemove = this.mouseMoveHandler;
    }


//для передвижения связей с движением пр-ков, нужно хранить локальные координаты
//отноительно 1ой точки связанного прям-ка. Далее координаты преобразовать в глобальные
    private moveRectangle(): void {
        if (this._mouseIsDown && this._indexOfTargetedRectangle >= 0) {
            if (
                ShapeUtils.isRectangleCollided(this._rectangles, this._rectangles[this._indexOfTargetedRectangle].getPointsInPosition(this._cursorPoint), this._indexOfTargetedRectangle) ||
                ShapeUtils.isRectangleInArea(this._rectangles[this._indexOfTargetedRectangle].getPointsInPosition(this._cursorPoint), this.getCanvasPoints()) // проверка, можно ли передвинуть прям-к
            ) {
                this._indexOfTargetedRectangle = -1;//сброс захваченного пр-ка
            } else {
                this._rectangles[this._indexOfTargetedRectangle].move(this._cursorPoint); //задаем новые координаты
            }
        }
    }

    private moveConnection(): void {
        if (this._mouseIsDown) {//зажата кнопка
            if (this._tempConnection)//если есть временная связь
                this._tempConnection.move(this._cursorPoint);//перезаписываем координаты конечной точки врем. связи
        }
    }

    private workWidthCanvas = (): void => {
        if (this._mode == Canvas.MOVE_RECTANGLE) {//выбарнный режим
            this.moveRectangle();
        }
        if (this._mode == Canvas.ADD_CONNECTION) {
            this.moveConnection();
        }
        this.drawShapes(); //отрисовка фигур
    }

    private drawConnections(): void {
        const indexOfHighlightedConnection = ShapeUtils.getConnectionIndexInPoint(this._connections, this._cursorPoint);//индекс выбранной связи курсором
        this._connections.map((c, i) => { //отрисовка связей
            if (i == indexOfHighlightedConnection) {//обводка выбранной
                c.render(true);
            } else {
                c.render();
            }
        });
    }

    private drawRectangles(): void {
        const indexOfHighlightedRectangle = ShapeUtils.getRectangleIndexInPoint(this._rectangles, this._cursorPoint); //индекс выделенного пр-ка курсором
        this._rectangles.map((r, i) => {//отрисовка пр-ков
            if (i == indexOfHighlightedRectangle) {//обводка выбранного
                r.render(true);
            } else {
                r.render();
            }
        });
    }

    private drawTempConnection(): void { //отрисовка временной связи
        if (this._tempConnection)
            this._tempConnection.render();
    }

    private drawShapes(): void {
        this.clearCanvas();
        this.drawConnections();
        this.drawRectangles();
        this.drawTempConnection();
    }

    private clearCanvas(): void { //очистка холста
        this._canvas.clearRect(0, 0, this._canvasElement.width, this._canvasElement.height);
    }

    public init(canvasElement: HTMLCanvasElement): void { //инциализация канвас, установка обработчиков событий и запуска цикла отрисовки
        this._canvasElement = canvasElement;
        this._canvas = this._canvasElement.getContext('2d');//2д контекст
        this.clearCanvas();
        this.initHandlers();
        setInterval(this.workWidthCanvas, this._speed);
    }
}