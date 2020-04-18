import { Color } from './color';
import { Rgb } from './rgb';
import { Hsl } from './hsl';

describe('Color', () => {
    describe('constructor', () => {
        it('should throw if hex is falsy', () => {
            const falsyValues = ['', null, undefined];
            falsyValues.forEach(value => {
                expect(() => new Color(value)).toThrowError('Hex color string must be provided.');
            });
        });

        it('should throw if invalid hex string', () => {
            const invalidValues = [
                'xyz',
                'rgb(0,2,3)',
                'fffffX',
                '111111111111',
                '9eab',
                '83940',
                '33'
            ];
            invalidValues.forEach(value => {
                expect(() => new Color(value)).toThrowError(`'${value}' is not a valid hex color string.`);
            });
        });

        it('should add "#" if not included', () => {
            const noHashHex = '123abc';

            const color = new Color(noHashHex);

            expect(color.hex).toBe('#' + noHashHex);
        });

        it('should set valid full-length hex values', () => {
            const validValues = [
                '#123abc',
                '#999888',
                'abcdef',
                '123456',
                '609609'
            ];
            validValues.forEach(value => {
                const color = new Color(value);

                expect(color.hex).toBe(value[0] === '#' ? value : '#' + value);
            });
        });

        it('should expand valid abbreviated hex values', () => {
            const tests: { hex: string, expected: string }[] = [
                { hex: 'fff', expected: '#ffffff' },
                { hex: '#609', expected: '#660099' },
                { hex: 'ab8', expected: '#aabb88' },
                { hex: '#000', expected: '#000000' },
                { hex: '#eab', expected: '#eeaabb' }
            ];
            tests.forEach(({hex, expected}) => {
                const color = new Color(hex);

                expect(color.hex).toBe(expected);
            });
        });
    });

    const HEX_RGB_EQUIVALENTS: {hex: string, rgb: number[]}[] = [
        { hex: '#000000', rgb: [0, 0, 0] },
        { hex: '#ffffff', rgb: [255, 255, 255] },
        { hex: '#660099', rgb: [102, 0, 153] },
        { hex: '#d8e651', rgb: [216, 230, 81] },
        { hex: '#3d1c92', rgb: [61, 28, 146] },
        { hex: '#59711a', rgb: [89, 113, 26] },
        { hex: '#ecd7c3', rgb: [236, 215, 195] },
        { hex: '#0076ff', rgb: [0, 118, 255] },
    ];

    describe('convertHexToRgb', () => {
        it('should return null if given falsy value', () => {
            const falsyValues = ['', null, undefined];

            falsyValues.forEach(value => {
                expect(Color.convertHexToRgb(value)).toBeNull();
            });
        });

        it('should convert correctly', () => {
            HEX_RGB_EQUIVALENTS.forEach(({hex, rgb}) => {
                expect(Color.convertHexToRgb(hex).toArray()).toEqual(rgb);
            });
        });
    });

    describe('convertRgbToHex', () => {
        it('should return empty string if given falsy value', () => {
            const falsyValues = [null, undefined];
            falsyValues.forEach(value => {
                expect(Color.convertRgbToHex(value)).toBe('');
            });
        });

        it('should convert correctly', () => {
            HEX_RGB_EQUIVALENTS.forEach(({hex, rgb: [r, g, b]}) => {
                expect(Color.convertRgbToHex(new Rgb({r, g, b}))).toBe(hex);
            });
        });
    });

    const RGB_HSL_EQUIVALENTS = [
        { rgb: [74, 142, 255], hsl: [217, 100, 65] },
        { rgb: [0, 0, 0], hsl: [0, 0, 0] },
        { rgb: [255, 255, 255], hsl: [0, 0, 100] },
        { rgb: [168, 60, 60], hsl: [0, 47, 45] },
        { rgb: [195, 195, 195], hsl: [0, 0, 76] },
        { rgb: [27, 193, 55], hsl: [130, 75, 43] },
        { rgb: [138, 77, 164], hsl: [282, 36, 47] },
        { rgb: [238, 208, 3], hsl: [52, 98, 47] },
        { rgb: [136, 132, 101], hsl: [53, 15, 46] },
        { rgb: [44, 89, 100], hsl: [192, 39, 28] },
    ];

    describe('convertRgbToHsl', () => {
        it('should convert correctly', () => {
            RGB_HSL_EQUIVALENTS.forEach(({ rgb: [r, g, b], hsl}) => {
                const rgb = new Rgb({r, g, b});
                const actualHsl = Color.convertRgbToHsl(rgb);

                expect(actualHsl.toArray()).toEqual(hsl);
            });
        });
    });

    describe('getter:relativeLuminance', () => {

        it('should return correct relative luminance', () => {
            const tests: { hex: string, expected: number}[] = [
                { hex: '#000000', expected: 0 },
                { hex: '#ffffff', expected: 1 },
                { hex: '#153a7b', expected: 0.046 },
                { hex: '#4d4d4d', expected: 0.074 },
                { hex: '#7b3bf6', expected: 0.14 },
                { hex: '#7dc896', expected: 0.479 },
                { hex: '#f5c8d2', expected: 0.654 },
                { hex: '#f5fbf6', expected: 0.951},
            ];

            tests.forEach(test => {
                const color = new Color(test.hex);

                expect(color.relativeLuminance).toBeCloseTo(test.expected, 3);
            });
        });
    });

    describe('getter:rgb', () => {
        it('should return Rgb', () => {
            const {hex, rgb} = HEX_RGB_EQUIVALENTS[0];
            const color = new Color(hex);

            const actualRgb = color.rgb;

            expect(actualRgb.toArray()).toEqual(rgb);
        });

        it('should return rgb multiple times', () => {
            const color = new Color('#ffffff');

            const rgb1 = color.rgb;
            const rgb2 = color.rgb;

            expect(color.rgb).toEqual(rgb1);
            expect(rgb1).toEqual(rgb2);
        });
    });
});
