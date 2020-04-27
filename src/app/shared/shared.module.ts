import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorInputComponent } from './color-input/color-input.component';
import { PopUpComponent } from './pop-up/pop-up.component';
import { HueSliderComponent } from './hue-slider/hue-slider.component';
import { SaturationLightnessFieldComponent } from './saturation-lightness-field/saturation-lightness-field.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ColorInputComponent,
    PopUpComponent,
    HueSliderComponent,
    SaturationLightnessFieldComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ColorInputComponent,
    PopUpComponent
  ]
})
export class SharedModule { }
