import { Rgb } from './rgb';

describe('Rgb', () => {
    const checkRgbValues = (rgb: Rgb, expectedValues: number[]) => {
        expect(rgb.r).toBe(expectedValues[0]);
        expect(rgb.g).toBe(expectedValues[1]);
        expect(rgb.b).toBe(expectedValues[2]);
    };

    describe('constructor', () => {
        it('should set r, g, and b', () => {
            const rgbValues = { r: 5, g: 45, b: 245 };

            const rgb = new Rgb(rgbValues);

            checkRgbValues(rgb, Object.values(rgbValues));
        });

        it('should set all component values to 0 if passed null', () => {
            const rgb = new Rgb(null);

            checkRgbValues(rgb, [0, 0, 0]);
        });

        it('should set all component values to 0 if passed undefined', () => {
            const rgb = new Rgb(undefined);

            checkRgbValues(rgb, [0, 0, 0]);
        });

        it('should set any falsy values to 0', () => {
            const rgb = new Rgb({ r: null, g: undefined, b: 0});

            checkRgbValues(rgb, [0, 0, 0]);
        });

        it('should set any values > 255 to 255', () => {
            const rgb = new Rgb({ r: 488, g: 256, b: 999});

            checkRgbValues(rgb, [255, 255, 255]);
        });

        it('should set any values < 0 to 0', () => {
            const rgb = new Rgb({ r: -488, g: -1, b: -13});

            checkRgbValues(rgb, [0, 0, 0]);
        });
    });

    describe('destandardize', () => {
        it('should not return a value greater than 255', () => {
            expect(Rgb.destandardize(100000)).toBe(255);
        });

        it('should not return a value less than 0', () => {
            expect(Rgb.destandardize(-100000)).toBe(0);
        });

        it('should return correctly destandardized values', () => {
            const tests = [
                {r: 255, g: 247, b: 210 },
                {r: 0, g: 12, b: 5 },
                {r: 127, g: 33, b: 241 },
                {r: 99, g: 57, b: 175 },
                {r: 151, g: 68, b: 200 }
            ];
            tests.forEach(rgbValues => {
                const rgb = new Rgb(rgbValues);
                const rgbArray = rgb.toArray();
                rgb.toStandardizedArray().forEach((standardizedValue, i) => {
                    expect(Rgb.destandardize(standardizedValue)).toBe(rgbArray[i]);
                });
            });
        });
    });

    describe('toArray', () => {
       it('should return array of length 3', () => {
           const rgb = new Rgb(null);

           expect(rgb.toArray().length).toBe(3);
       });

       it('should return r, g, and b in that order', () => {
           const rgbValues = { r: 88, g: 99, b: 234 };
           const rgb = new Rgb(rgbValues);

           const [actualR, actualG, actualB] = rgb.toArray();

           expect(actualR).toBe(rgbValues.r);
           expect(actualG).toBe(rgbValues.g);
           expect(actualB).toBe(rgbValues.b);
       });
    });

    describe('toStandardizedArray', () => {
        const PRECISION = 4;
        const standardTests: {eightBit: number, standard: number}[] = [
            { eightBit: 255, standard: 1 },
            { eightBit: 15, standard: 0.00478 },
            { eightBit: 155, standard: 0.32778 },
            { eightBit: 100, standard: 0.12744 },
            { eightBit: 0, standard: 0 },
            { eightBit: 3, standard: 0.00091 },
            { eightBit: 55, standard: 0.0382 },
            { eightBit: 112, standard: 0.16203 },
            { eightBit: 87, standard: 0.09531},
            { eightBit: 11, standard: 0.00335 },
            { eightBit: 33, standard: 0.01521 },
            { eightBit: 241, standard: 0.87962 },
        ];

        it('should return array of length 3', () => {
            const rgb = new Rgb({ r: 4, g: 3, b: 3});

            expect(rgb.toStandardizedArray().length).toBe(3);
        });

        it('should return standard values for r, g, and b in that order', () => {
            const rgbValuesTests = { r: standardTests[0], g: standardTests[1], b: standardTests[2]};
            const rgb = new Rgb(
                {r: rgbValuesTests.r.eightBit, g: rgbValuesTests.g.eightBit, b: rgbValuesTests.b.eightBit});

            rgb.toStandardizedArray().forEach((actual, i) => {
                expect(actual).toBeCloseTo(Object.values(rgbValuesTests)[i].standard, PRECISION);
            });
        });

        it('should correctly standardize values', () => {
            const standardsInThrees = standardTests.reduce((prev, curr, i) => {
                if (i % 3 === 0) {
                    prev.push([curr]);
                } else {
                    prev[prev.length - 1].push(curr);
                }
                return prev;
            }, []);

            standardsInThrees.forEach(([rStandard, gStandard, bStandard]) => {
                const rgb = new Rgb({r: rStandard.eightBit, g: gStandard.eightBit, b: bStandard.eightBit});

                const [rActual, gActual, bActual] = rgb.toStandardizedArray();

                expect(rActual).toBeCloseTo(rStandard.standard, PRECISION);
                expect(gActual).toBeCloseTo(gStandard.standard, PRECISION);
                expect(bActual).toBeCloseTo(bStandard.standard, PRECISION);
            });
        });
    });

    describe('toString', () => {
        const toStringTests = [
            { rgb: { r: 44, g: 48, b: 99 }, expected: 'rgb(44,48,99)'},
            { rgb: { r: 0, g: 0, b: 0 }, expected: 'rgb(0,0,0)'},
            { rgb: { r: 255, g: 255, b: 255 }, expected: 'rgb(255,255,255)'},
            { rgb: { r: 136, g: 193, b: 53 }, expected: 'rgb(136,193,53)'},
            { rgb: { r: 241, g: 242, b: 243 }, expected: 'rgb(241,242,243)'},
            { rgb: { r: 5, g: 123, b: 234 }, expected: 'rgb(5,123,234)'},
        ];

        it('should return the correct string', () =>
            toStringTests.forEach(({rgb, expected}) =>
                expect(new Rgb(rgb).toString()).toBe(expected)));
    });
});
