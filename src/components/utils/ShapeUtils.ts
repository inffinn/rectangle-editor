import {IPoint} from "../../Interfaces/Interfaces";
import Rectangle from '../classes/Rectangle';
import Connection from '../classes/Connection';

//класс для работы с фигурами
export default class ShapeUtils {

    public static isRectangleInArea(rectanglePoints: Array<IPoint>, areaPoints: Array<IPoint>): boolean { //прямоугольник в пределах прощади
        const result: boolean = rectanglePoints.some((point: IPoint) => {
            if (areaPoints[0].x > point.x || point.x > areaPoints[2].x
                || areaPoints[0].y > point.y || point.y > areaPoints[2].y) {
                return true;
            }
        })
        return result;
    }

// накладывается ли прямоугольник на другие пр-ки
    public static isRectangleCollided = (rectangles: Array<Rectangle>, rectanglePoints: Array<IPoint>, excludeRectangleIndex?: number): boolean => {
        const result: boolean = rectangles.some((r, ri) => {
            if (excludeRectangleIndex === ri)//захваченный пр-к не может перекрывать сам себя
                return false;
            const delta:number = (rectanglePoints[2].x - rectanglePoints[0].x) - (r.points[2].x - r.points[0].x);//какой из прямоугольников больше
            if (delta <= 0) { //выбранный пря-к меньше
                const result: boolean = r.points.some((val, i) => {
                    if (r.points[0].x <= rectanglePoints[i].x && rectanglePoints[i].x <= r.points[2].x
                        && r.points[0].y <= rectanglePoints[i].y && rectanglePoints[i].y <= r.points[2].y) {
                        return true;
                    }
                })
                return result;
            } else {//выбранный пр-к больше
                const result:boolean = r.points.some((val, i) => {
                    if (r.points[i].x > rectanglePoints[0].x && rectanglePoints[2].x > r.points[i].x
                        && r.points[i].y > rectanglePoints[0].y && rectanglePoints[2].y > r.points[i].y) {
                        return true;
                    }
                })
                return result;
            }
        })
        return result; // true- наложение пря-ков обнаружено
    }

    //ф-я поиска индекса прям-ка по координатам курсора, по тому же алгоритму,что и для наложений прям-ков, только для одной точки
    public static getRectangleIndexInPoint(rectangles: Array<Rectangle>, point: IPoint): number {
        let index: number = -1;
        for (let i: number = 0; i < rectangles.length; i++) {
            if (rectangles[i].points[0].x <= point.x && point.x <= rectangles[i].points[2].x
                && rectangles[i].points[0].y <= point.y && point.y <= rectangles[i].points[2].y) {
                index = i;
                break;
            }
        }
        return index;
    }

//ф-я поиска индекса связи под курсором по формуле обнаружения точки на отрезке
    public static getConnectionIndexInPoint = (connections: Array<Connection>, cursorPosition: IPoint): number => {
        let index: number = -1;
        for (let i: number = 0; i < connections.length; i++) {//обход всех связей
            let p3: IPoint = cursorPosition,
                p1: IPoint = connections[i].startPoint,
                p2: IPoint = connections[i].endPoint,
                deltaX: number = (p2.x - p1.x),
                deltaY: number = (p2.y - p1.y);
            if (deltaX == 0) {
                deltaX = 1;
            }
            if (deltaY == 0) {
                deltaY = 1;
            }
            const result: number = Math.abs((p3.x - p1.x) / deltaX - (p3.y - p1.y) / deltaY);
            if (result <= 0.1) {//допустимая погрешность
                index = i;
                break;
            }
        }
        return index;
    }
}
