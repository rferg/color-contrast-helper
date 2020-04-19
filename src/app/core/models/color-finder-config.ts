import { Color } from './color';
import { nameof } from './nameof';

/**
 * Configuration for finding color that meets desired contrast ratio
 * against {@link ColorFinderConfig.staticColor}.
 */
export class ColorFinderConfig {
    /**
     * The color to replace to meet desired contrast ratio.
     */
    colorToAlter: Color;
    /**
     * The color to compare against.
     */
    readonly staticColor: Color;
    /**
     * The desired contrast ratio.
     */
    readonly desiredContrastRatio: number;

    constructor(colorToAlter: Color, staticColor: Color, desiredContrastRatio: number) {
        if (!colorToAlter) {
            throw new Error(`${nameof<ColorFinderConfig>('colorToAlter')} is required for ${ColorFinderConfig.name}`);
        }
        this.colorToAlter = colorToAlter;

        if (!staticColor) {
            throw new Error(`${nameof<ColorFinderConfig>('staticColor')} is required for ${ColorFinderConfig.name}`);
        }
        this.staticColor = staticColor;

        if (desiredContrastRatio === null || desiredContrastRatio === undefined) {
            throw new Error(
                `${nameof<ColorFinderConfig>('desiredContrastRatio')} is required for ${ColorFinderConfig.name}`);
        }
        this.desiredContrastRatio = desiredContrastRatio;
    }
}
