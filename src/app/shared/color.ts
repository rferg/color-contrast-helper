import { Rgb } from './rgb';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

/**
 * Represents a color.
 */
export class Color {
    /**
     * Coefficients for standardized R, G, and B values, respectively,
     * for calculating relative luminance of a color
     * (see https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef).
     */
    private static readonly LUMINANCE_COEFFICIENTS: number[] = [0.2126, 0.7152, 0.0722];

    private _hex: string;
    /**
     * Gets the hexadecimal string representation of this color, e.g., '#FFFFFF'.
     */
    get hex(): string {
        return this._hex;
    }

    private _rgb: Rgb;
    /**
     * Gets the color represented as {@link Rgb}
     */
    get rgb(): Rgb {
        if (!this._rgb) {
            this._rgb = Color.convertHexToRgb(this.hex);
        }
        return this._rgb;
    }

    private _relativeLuminance: number;
    /**
     * Gets relative luminance of this color as defined
     * [here]{@link https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef}
     */
    get relativeLuminance(): number {
        if (this._relativeLuminance === null || this._relativeLuminance === undefined) {
            this._relativeLuminance = this.getRelativeLuminance();
        }
        return this._relativeLuminance;
    }

    /**
     * Creates an instance of Color.
     * @param hex the hexadecimal string representing this color, e.g., '#88ff44'.
     */
    constructor(hex: string) {
        this._hex = this.validateHex(hex);
    }

    /**
     * Converts hexadecimal color string to {@link Rgb}
     * @param hex the hexadecimal color string, e.g., '#88ff43'.
     * @returns the {@link Rgb} representing the same color (if valid)
     */
    static convertHexToRgb(hex: string): Rgb {
        if (!hex) { return null; }
        const [r, g, b] = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i,
                (_, rString, gString, bString) => '#' + rString + rString + gString + gString + bString + bString)
            .substring(1).match(/.{2}/g)
            .map(x => parseInt(x, 16));
        return new Rgb({r, g, b});
    }

    /**
     * Converts {@link Rgb} to hexadecimal color string, e.g., '#88ff45'.
     * @param rgb the {@link Rgb} to convert
     * @returns hexadecimal string representation of the same color
     */
    static convertRgbToHex(rgb: Rgb): string {
        if (!rgb) { return ''; }
        return '#' + rgb.toArray().map(rgbValue => rgbValue.toString(16).padStart(2, '0')).join('');
    }

    private getRelativeLuminance(): number {
        return this.rgb.toStandardizedArray().reduce((result: number, rgbValue: number, index: number): number =>
            result + Color.LUMINANCE_COEFFICIENTS[index] * rgbValue, 0);
    }

    private validateHex(hex: string): string {
        if (!hex) {
            throw new Error('Hex color string must be provided.');
        }

        const validationRegex = /^#?([a-f\d]{3}){1,2}$/i;
        if (!validationRegex.test(hex)) {
            throw new Error(`'${hex}' is not a valid hex color string.`);
        }

        if (hex[0] !== '#') {
            hex = '#' + hex;
        }

        if (hex.length === 4) {
            hex = this.expandAbbreviatedHex(hex);
        }

        return hex;
    }

    /**
     * Expands 3-character hex string into 6
     * @param hex abbreviated hex string; must start with '#'
     */
    private expandAbbreviatedHex(hex: string): string {
        let expanded = '';
        for (const char of hex) { expanded += (char + (char === '#' ? '' : char)); }
        return expanded;
    }
}
