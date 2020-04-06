/**
 * RGB representation of a color.
 */
export class Rgb {
    /**
     * The red component of this color.
     */
    readonly r: number;
    /**
     * The green component of this color.
     */
    readonly g: number;
    /**
     * The blue component of this color.
     */
    readonly b: number;

    private _standardizedR: number;
    /**
     * Gets the sRGB standardized red component of this color.
     */
    private get standardizedR(): number {
        if (this._standardizedR === null || this._standardizedR === undefined) {
            this._standardizedR = this.standardize(this.r);
        }
        return this._standardizedR;
    }

    private _standardizedG: number;
    /**
     * Gets the sRGB standardized green component of this color.
     */
    private get standardizedG(): number {
        if (this._standardizedG === null || this._standardizedG === undefined) {
            this._standardizedG = this.standardize(this.g);
        }
        return this._standardizedG;
    }

    private _standardizedB: number;
    /**
     * Gets the sRGB standardized blue component of this color.
     */
    private get standardizedB(): number {
        if (this._standardizedB === null || this._standardizedB === undefined) {
            this._standardizedB = this.standardize(this.b);
        }
        return this._standardizedB;
    }

    /**
     * Creates an instance of Rgb.
     * @param rgbValues the component 8 bit values of the color, i.e., they should be >= 0 and <= 255.
     */
    constructor(rgbValues: {r: number, g: number, b: number}) {
        const { r, g, b } = rgbValues || {};
        this.r = Math.max(0, Math.min(r || 0, 255));
        this.g = Math.max(0, Math.min(g || 0, 255));
        this.b = Math.max(0, Math.min(b || 0, 255));
    }

    /**
     * Returns array of RGB values, with R as first element, G as second, and B as third.
     * @returns array of RGB values, with R as first element, G as second, and B as third
     */
    toArray(): number[] {
        return [this.r, this.g, this.b];
    }

    /**
     * Returns array of standard RGB (i.e., sRGB) values
     * according to https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef.
     * R is the first element, G is second, and B is third.
     * @returns array of standardized RGB values
     */
    toStandardizedArray(): number[] {
        return [this.standardizedR, this.standardizedG, this.standardizedB];
    }

    /**
     * Returns the CSS string value of this RGB, e.g., 'rgb(0,155,24)'
     * @returns the CSS string value of this RGB, e.g., 'rgb(0,155,24)';
     */
    toString(): string {
        return `rgb(${this.toArray().join(',')})`;
    }

    /**
     * Standardizes component of RGB color
     * according to https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
     * @param rgbValue - the value of the RGB component, e.g., R; should be between 0 and 255.
     * @returns standardized value of RGB component
     */
    private standardize(rgbValue: number): number {
        const normed = rgbValue / 255;
        const threshold = 0.03928;
        if (normed <= threshold) { return normed / 12.92; }
        return ((normed + 0.055) / 1.055) ** 2.4;
    }
}
