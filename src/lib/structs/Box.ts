export class ROIBox {
    public x: number;
    public y: number;
    public w: number;
    public h: number;
    public rotation: number;

    constructor(x: number = 0, y: number = 0, w: number = 0, h: number = 0, rotation: number = 0) {
        this.x = Math.trunc(Number(x)); // Ensures it's an integer
        this.y = Math.trunc(Number(y));
        this.w = Math.trunc(Number(w));
        this.h = Math.trunc(Number(h));
        this.rotation = Math.trunc(Number(rotation));
    }

    public isValid(): boolean {
        return this.w >= 0 && this.h >= 0;
    }
}
