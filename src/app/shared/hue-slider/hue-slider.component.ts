import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-hue-slider',
  templateUrl: './hue-slider.component.html',
  styleUrls: ['./hue-slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HueSliderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
