import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-saturation-lightness-field',
  templateUrl: './saturation-lightness-field.component.html',
  styleUrls: ['./saturation-lightness-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaturationLightnessFieldComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
