import { Component } from '@angular/core';
import { Color } from './core/models/color';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  color: Color = new Color('#E6AACE');

  colorChange(color: Color) {
    this.color = color;
    console.log(this.color.hex, this.color.relativeLuminance);
  }
}
