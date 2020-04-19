/**
 * HSL representation of a color.
 */
export class Hsl {
    /**
     * The hue value.
     */
    readonly h: number;
    /**
     * The saturation value.
     */
    readonly s: number;
    /**
     * The luminance value.
     */
    readonly l: number;

    constructor(hslValues: {h: number, s: number, l: number}) {
        const { h, s, l } = hslValues || {};
        this.h = Math.min(Math.max(h || 0, 0), 360);
        this.s = Math.min(Math.max(s || 0, 0), 100);
        this.l = Math.min(Math.max(l || 0, 0), 100);
    }

    /**
     * Returns the hue, saturation, and luminance values in that order as an array.
     * @returns array of hue, saturation, and luminance values in that order.
     */
    toArray(): number[] {
        return [this.h, this.s, this.l];
    }

    /**
     * Returns the string representation of this Hsl, usable for CSS.
     * @returns the string representation of this Hsl.
     */
    toString(): string {
        return `hsl(${this.h},${this.s}%,${this.l}%)`;
    }
}
