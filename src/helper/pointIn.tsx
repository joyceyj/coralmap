
function isPointInBoundingBox(x:number, y:number, boundingBox: number[]): boolean {
    const min = {x: boundingBox[0], y: boundingBox[1]};
    const max = {x: boundingBox[0]+boundingBox[2], y: boundingBox[1]+boundingBox[3]};

    return x >= min.x && x <= max.x && y >= min.y && y <= max.y;
}
function isPointInPolygon(x:number, y:number, mask: number[][]): boolean {
    return mask[y][x] == 1? true:false;
}
  
export { isPointInBoundingBox, isPointInPolygon };