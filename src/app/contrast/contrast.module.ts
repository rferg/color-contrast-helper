import { NgModule } from '@angular/core';

import { ContrastRoutingModule } from './contrast-routing.module';
import { ContrastComponent } from './contrast.component';
import { SharedModule } from '../shared/shared.module';
import { ContrastRatioService } from './contrast-ratio.service';


@NgModule({
  declarations: [ContrastComponent],
  imports: [
    SharedModule,
    ContrastRoutingModule
  ],
  providers: [
    ContrastRatioService
  ]
})
export class ContrastModule { }
