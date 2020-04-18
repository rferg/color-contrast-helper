export class Hsl {
    readonly h: number;
    readonly s: number;
    readonly l: number;

    constructor(hslValues: {h: number, s: number, l: number}) {
        const { h, s, l } = hslValues || {};
        this.h = Math.min(Math.max(h || 0, 0), 360);
        this.s = Math.min(Math.max(s || 0, 0), 100);
        this.l = Math.min(Math.max(l || 0, 0), 100);
    }

    toArray(): number[] {
        return [this.h, this.s, this.l];
    }

    toString(): string {
        return `hsl(${this.h},${this.s}%,${this.l}%)`;
    }
}
