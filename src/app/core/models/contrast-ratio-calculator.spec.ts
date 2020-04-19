import { Color } from './color';
import { ContrastRatioCalculator } from './contrast-ratio-calculator';

describe('ContrastRatioCalculator', () => {
    const calculator = new ContrastRatioCalculator();
    const mockColorA = jasmine.createSpyObj<Color>('ColorA', [], ['relativeLuminance']);
    const mockColorB = jasmine.createSpyObj<Color>('ColorB', [], ['relativeLuminance']);

    describe('getContrastRatio', () => {
        it('should throw if one color is falsy', () => {
            const falsyValues = [null, undefined];
            falsyValues.forEach(value => {
                expect(() => calculator.getContrastRatio(value, mockColorB)).toThrowError();
                expect(() => calculator.getContrastRatio(mockColorA, value)).toThrowError();
            });
        });

        it('should throw if both colors are falsy', () => {
            const falsyValues = [null, undefined];
            falsyValues.forEach(value => {
                expect(() => calculator.getContrastRatio(value, value)).toThrowError();
            });
        });

        it('should return the correct contrast ratio', () => {
            const tests = [
                [0, 0, 1],
                [1, 1, 1],
                [0.38, 0.12, 2.529],
                [0.12, 0.38, 2.529],
                [0.598, 0.07, 5.4],
                [0.0623, 0.178, 2.03],
                [0.0135, 0.754, 12.661],
                [0.956, 0.089, 7.237],
                [0.0001, 0.98, 20.559]
            ];
            tests.forEach(([luminanceA, luminanceB, expected]) => {
                const colorA = new Color('fff');
                const colorB = new Color('fff');
                spyOnProperty(colorA, 'relativeLuminance', 'get').and.returnValue(luminanceA);
                spyOnProperty(colorB, 'relativeLuminance', 'get').and.returnValue(luminanceB);
                expect(calculator.getContrastRatio(colorA, colorB)).toBeCloseTo(expected, 3);
            });
        });
    });
});
