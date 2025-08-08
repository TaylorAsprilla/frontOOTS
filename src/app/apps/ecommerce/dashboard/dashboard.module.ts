import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';


import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';




@NgModule({
    imports: [
    CommonModule,
    NgApexchartsModule,
    NgbDropdownModule,
    DashboardRoutingModule,
    DashboardComponent
]
})
export class DashboardModule { }
