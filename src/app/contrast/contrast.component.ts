import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Color } from '../core/models/color';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { ContrastRatioService } from './contrast-ratio.service';

@Component({
  selector: 'app-contrast',
  templateUrl: './contrast.component.html',
  styleUrls: ['./contrast.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContrastComponent {
  private foregroundSource = new BehaviorSubject<Color>(new Color('#000'));
  foreground$: Observable<Color> = this.foregroundSource.asObservable();

  private backgroundSource = new BehaviorSubject<Color>(new Color('#fff'));
  background$: Observable<Color> = this.backgroundSource.asObservable();

  private minimumRatioSource = new BehaviorSubject<number>(7);
  minimumRatio$: Observable<number> = this.minimumRatioSource.asObservable();

  contrastRatio$: Observable<number> = combineLatest([this.foreground$, this.background$]).pipe(
    map(([foreground, background]) => this.contrastRatioService.getContrastRatio(foreground, background))
  );

  ratioIsBelowMin$: Observable<boolean> = combineLatest([this.contrastRatio$, this.minimumRatio$]).pipe(
    map(([ contrastRatio, min]) => contrastRatio < min)
  );


  constructor(private contrastRatioService: ContrastRatioService) { }

  foregroundChange(color: Color): void {
    this.foregroundSource.next(color);
  }

  backgroundChange(color: Color): void {
    this.backgroundSource.next(color);
  }

  minimumRatioChange(ratio: number): void {
    this.minimumRatioSource.next(ratio);
  }

}
