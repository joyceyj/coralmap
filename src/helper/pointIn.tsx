
interface Point {
    x: number;
    y: number;
}
function isPointInBoundingBox(x:number, y:number, boundingBox: number[]): boolean {
    const min = {x: boundingBox[0], y: boundingBox[1]};
    const max = {x: boundingBox[0]+boundingBox[2], y: boundingBox[1]+boundingBox[3]};

    return x >= min.x && x <= max.x && y >= min.y && y <= max.y;
}
function isPointInPolygon(point: Point, polygon: Point[]): boolean {
    const x = point.x;
    const y = point.y;
    let isInside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].x;
        const yi = polygon[i].y;
        const xj = polygon[j].x;
        const yj = polygon[j].y;

        const intersect =
        ((yi > y) !== (yj > y)) &&
        (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);

        if (intersect) {
        isInside = !isInside;
        }
    }

    return isInside;
}
  
  export { isPointInBoundingBox, isPointInPolygon };