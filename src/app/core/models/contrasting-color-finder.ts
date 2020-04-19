import { ContrastRatioCalculator } from './contrast-ratio-calculator';
import { ColorFinderConfig } from './color-finder-config';
import { Color } from './color';
import { Rgb } from './rgb';

export class ContrastingColorFinder {

    /**
     * Alters a color to produce one that
     * meets the given desired contrast ratio when compared against
     * a given static color.
     * @param configs the configuration objects containing required parameters
     */
    findContrastingColors(...configs: ColorFinderConfig[]): Color[] {
        return configs.map(config => {
            this.validateConfig(config);

            const colorToAlterLuminance = config.colorToAlter.relativeLuminance;
            const staticColorLuminance = config.staticColor.relativeLuminance;

            const desiredLuminance =
                this.getDesiredLuminance(config.desiredContrastRatio, colorToAlterLuminance, staticColorLuminance);

            // The adjustment factor will be the ratio of the desired luminance to the actual luminance.
            const adjustmentFactor = this.getAdjustmentFactor(desiredLuminance, colorToAlterLuminance);

            const [adjustedR, adjustedG, adjustedB] = config.colorToAlter.rgb.toStandardizedArray()
                // Multiply the standard RGB values by the adjustment factor,
                // since these are what are used to calculate relative luminance.
                .map(standardValue => standardValue * adjustmentFactor)
                // Revert these adjusted values to linear RGB so we can get the resulting color.
                .map(adjustedStandardValue => Rgb.destandardize(adjustedStandardValue));

            const adjustedRgb = new Rgb({r: adjustedR, g: adjustedG, b: adjustedB});
            return new Color(Color.convertRgbToHex(adjustedRgb));
        });
    }

    /**
     * This function solves for colorToAlterLuminance given the desired contrast ratio
     * using the contrast ratio formula (see {@link ContrastRatioCalculator.getContrastRatio})
     */
    private getDesiredLuminance(
        desiredContrastRatio: number,
        colorToAlterLuminance: number,
        staticColorLuminance: number): number {
            const [initialSolver, backupSolver] = colorToAlterLuminance >= staticColorLuminance
                ? [this.solveForLighterDesiredLuminance, this.solveForDarkerDesiredLuminance]
                : [this.solveForDarkerDesiredLuminance, this.solveForLighterDesiredLuminance];
            const initialValue = initialSolver(desiredContrastRatio, staticColorLuminance);
            if (initialValue > 0) {
                return initialValue;
            }
            // In the case where the initially computed desired luminance is negative,
            // this indicates that this is a "crossover" scenario, where
            // going from the colorToAlter to the best color "crosses over" the luminance value
            // of the staticColor.  So we find the desired luminance by switching the luminance
            // values in the contrast ratio calculation.
            return backupSolver(desiredContrastRatio, staticColorLuminance);
    }

    private solveForLighterDesiredLuminance(desiredContrastRatio: number, staticColorLuminance: number): number {
        const adjustment = ContrastRatioCalculator.LUMINANCE_ADJUSTMENT;
        return (desiredContrastRatio * staticColorLuminance)
                    + (desiredContrastRatio * adjustment) - adjustment;
    }

    private solveForDarkerDesiredLuminance(desiredContrastRatio: number, staticColorLuminance: number): number {
        const adjustment = ContrastRatioCalculator.LUMINANCE_ADJUSTMENT;
        return ((staticColorLuminance + adjustment) - (adjustment * desiredContrastRatio)) / desiredContrastRatio;
    }

    private validateConfig(config: ColorFinderConfig) {
        if (!config) {
            throw new Error('ColorFinderConfig is required.');
        }

        if (1 > config.desiredContrastRatio || config.desiredContrastRatio > 21) {
            throw new Error(
                `Desired contrast ratio of ${config.desiredContrastRatio} is invalid.  ` +
                `It must be between 1 and 21 inclusive.`);
        }
        // In the special case where #000000 is the color to be altered, change
        // it to #010101 to make calculations more convenient.
        // This is because RGB and luminance values of 0 will cause two problems:
        // i) can't divide by 0 to get adjustment factor
        // and ii) even if (i) is solved, multiplying RGB values of 0 by the adjustment factor
        // won't actually alter the color.
        if (config.colorToAlter.hex === '#000000') {
            config.colorToAlter = new Color('#010101');
        }
    }

    private getAdjustmentFactor(desiredLuminance: number, actualLuminance: number): number {
        return desiredLuminance / actualLuminance;
    }

}
