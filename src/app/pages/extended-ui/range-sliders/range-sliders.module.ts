import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

import { RangeSlidersRoutingModule } from './range-sliders-routing.module';
import { RangeSlidersComponent } from './range-sliders.component';

@NgModule({
    imports: [
    CommonModule,
    NgxSliderModule,
    RangeSlidersRoutingModule,
    RangeSlidersComponent
]
})
export class RangeSlidersModule { }
