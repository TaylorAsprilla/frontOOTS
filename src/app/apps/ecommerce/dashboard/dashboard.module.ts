import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { WidgetModule } from 'src/app/shared/widget/widget.module';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';




@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    NgApexchartsModule,
    NgbDropdownModule,
    WidgetModule,
    PageTitleModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
