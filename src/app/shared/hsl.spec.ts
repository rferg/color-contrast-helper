import { Hsl } from './hsl';

describe('Hsl', () => {
    describe('constructor', () => {
        it('should set values to 0 if given falsy argument', () => {
            const falsyValues = [null, undefined];
            falsyValues.forEach(value => {
                const hsl = new Hsl(value);
                expect(hsl.toArray()).toEqual([0, 0, 0]);
            });
        });

        it('should set values to 0 if given values less than 0', () => {
            const hsl = new Hsl({ h: -4, s: -14, l: -100});

            expect(hsl.toArray()).toEqual([0, 0, 0]);
        });

        it('should set values to maximum if given greater than max values', () => {
            const hsl = new Hsl({ h: 400, s: 120, l: 150 });

            expect(hsl.toArray()).toEqual([360, 100, 100]);
        });
    });

    describe('toArray', () => {
        it('should return h,s,l in that order', () => {
            const hslValues = { h: 44, s: 55, l: 66 };
            const hsl = new Hsl(hslValues);

            expect(hsl.toArray()).toEqual([hslValues.h, hslValues.s, hslValues.l]);
        });
    });

    describe('toString', () => {
        it('should return correct string', () => {
            const tests = [
                { h: 44, s: 0, l: 37 },
                { h: 254, s: 46, l: 100 },
                { h: 123, s: 88, l: 0 },
                { h: 94, s: 44, l: 46 },
                { h: 0, s: 1, l: 1 }
            ];
            tests.forEach(hslValues => {
                const hsl = new Hsl(hslValues);

                expect(hsl.toString()).toEqual(`hsl(${hslValues.h},${hslValues.s}%,${hslValues.l}%)`);
            });
        });
    });
});
