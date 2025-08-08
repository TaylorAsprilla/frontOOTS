import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { RangeSlidersRoutingModule } from './range-sliders-routing.module';
import { RangeSlidersComponent } from './range-sliders.component';

@NgModule({
  declarations: [
    RangeSlidersComponent
  ],
  imports: [
    CommonModule,
    NgxSliderModule,
    PageTitleModule,
    RangeSlidersRoutingModule
  ]
})
export class RangeSlidersModule { }
