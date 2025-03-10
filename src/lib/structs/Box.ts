export class Box {
    public x: number;
    public y: number;
    public w: number;
    public h: number;

    constructor(x: number = 0, y: number = 0, w: number = 0, h: number = 0) {
        this.x = Math.trunc(Number(x)); // Ensures it's an integer
        this.y = Math.trunc(Number(y));
        this.w = Math.trunc(Number(w));
        this.h = Math.trunc(Number(h));
    }
}
