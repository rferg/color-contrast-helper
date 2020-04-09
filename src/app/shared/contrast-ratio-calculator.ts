import { Color } from './color';

/**
 * Provides method for calculating the contrast ratio of two colors.
 */
export class ContrastRatioCalculator {
    private static LUMINANCE_ADJUSTMENT = 0.05;

    /**
     * Calculates the contrast ratio of two colors
     * (see https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html#contrast-ratiodef).
     * @param a a {@link Color}
     * @param b the other {@link Color}
     */
    getContrastRatio(a: Color, b: Color): number {
        if (!a || !b) {
            throw new Error('Cannot calculate contrast ratio if one or both colors are null or undefined.');
        }

        const [greaterLuminance, lesserLuminance] = a.relativeLuminance >= b.relativeLuminance
            ? [a.relativeLuminance, b.relativeLuminance]
            : [b.relativeLuminance, a.relativeLuminance];

        return (greaterLuminance + ContrastRatioCalculator.LUMINANCE_ADJUSTMENT)
            / (lesserLuminance + ContrastRatioCalculator.LUMINANCE_ADJUSTMENT);
    }
}
