import { ContrastingColorFinder } from './contrasting-color-finder';
import { ColorFinderConfig } from './color-finder-config';
import { Color } from './color';

describe('ContrastingColorFinder', () => {
    const finder = new ContrastingColorFinder();

    describe('findContrastingColors', () => {
        it('should throw if config is falsy', () => {
            const falsyValues = [null, undefined];
            falsyValues.forEach(value => {
                expect(() => finder.findContrastingColors(value)).toThrowError('ColorFinderConfig is required.');
            });
        });

        it('should throw if config.desiredContrastRatio < 1 or > 21', () => {
            const invalidRatios = [0, -1, 21.1, 34];
            invalidRatios.forEach(ratio => {
                const config = new ColorFinderConfig(new Color('fff'), new Color('fff'), ratio);

                expect(() => finder.findContrastingColors(config)).toThrowError(
                    `Desired contrast ratio of ${config.desiredContrastRatio} is invalid.  ` +
                        `It must be between 1 and 21 inclusive.`);
            });
        });

        it('should update config.colorToAlter if #000000', () => {
            const config = new ColorFinderConfig(new Color('#000'), new Color('fff'), 3);

            finder.findContrastingColors(config);

            expect(config.colorToAlter.hex).toBe('#010101');
        });

        it('should produce the correct colors', () => {
            const tests: { config: ColorFinderConfig, expectedColor: Color }[] = [
                {
                    config: new ColorFinderConfig(
                        new Color('#aaa'),
                        new Color('#fff'),
                        4),
                    expectedColor: new Color('#7f7f7f')
                },
                {
                    config: new ColorFinderConfig(
                        new Color('#9C38FF'),
                        new Color('#88CC93'),
                        7),
                    expectedColor: new Color('#431473')
                },
                {
                    config: new ColorFinderConfig(
                        new Color('#8C8C8C'),
                        new Color('#F2F4F8'),
                        4.5),
                    expectedColor: new Color('#707070')
                },
                {
                    config: new ColorFinderConfig(
                        new Color('#0000A0'),
                        new Color('#E173D9'),
                        7),
                    expectedColor: new Color('#000048')
                },
                {
                    config: new ColorFinderConfig(
                        new Color('#A02297'),
                        new Color('#E173D9'),
                        7),
                    expectedColor: new Color('#21021f')
                },
                {
                    config: new ColorFinderConfig(
                        new Color('#4143A5'),
                        new Color('#56B436'),
                        2),
                    expectedColor: new Color('#595cdc')
                },
                {
                    config: new ColorFinderConfig(
                        new Color('#9999AA'),
                        new Color('#FFFFFF'),
                        5),
                    expectedColor: new Color('#6e6e7b')
                },
            ];

            const results = finder.findContrastingColors(...tests.map(test => test.config));
            results.forEach((actualColor, i) => expect(actualColor.hex).toBe(tests[i].expectedColor.hex));
        });
    });
});
