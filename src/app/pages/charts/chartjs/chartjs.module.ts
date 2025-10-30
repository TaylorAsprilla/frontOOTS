import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartjsRoutingModule } from './chartjs-routing.module';
import { ChartjsComponent } from './chartjs.component';
import { NgChartsModule } from 'ng2-charts';



@NgModule({
  declarations: [
    ChartjsComponent
  ],
  imports: [
    CommonModule,
    NgChartsModule,
    ChartjsRoutingModule
]
})
export class ChartjsModule { }
