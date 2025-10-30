import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JoyrideModule } from "ngx-joyride";

import { TourPageRoutingModule } from './tour-page-routing.module';
import { TourPageComponent } from './tour-page.component';


@NgModule({
    imports: [
    CommonModule,
    JoyrideModule,
    TourPageRoutingModule,
    TourPageComponent
]
})
export class TourPageModule { }
