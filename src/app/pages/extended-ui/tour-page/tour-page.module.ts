import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JoyrideModule } from "ngx-joyride";
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { TourPageRoutingModule } from './tour-page-routing.module';
import { TourPageComponent } from './tour-page.component';


@NgModule({
  declarations: [
    TourPageComponent
  ],
  imports: [
    CommonModule,
    JoyrideModule,
    PageTitleModule,
    TourPageRoutingModule
  ]
})
export class TourPageModule { }
