import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartjsRoutingModule } from './chartjs-routing.module';
import { ChartjsComponent } from './chartjs.component';
import { NgChartsModule } from 'ng2-charts';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';


@NgModule({
  declarations: [
    ChartjsComponent
  ],
  imports: [
    CommonModule,
    NgChartsModule,
    PageTitleModule,
    ChartjsRoutingModule
  ]
})
export class ChartjsModule { }
