import { Injectable } from '@angular/core';
import { ContrastRatioCalculator } from '../core/models/contrast-ratio-calculator';
import { Color } from '../core/models/color';

@Injectable()
export class ContrastRatioService {
  private calculator: ContrastRatioCalculator;

  constructor() {
    this.calculator = new ContrastRatioCalculator();
  }

  getContrastRatio(a: Color, b: Color): number {
    return this.calculator.getContrastRatio(a, b);
  }
}
