import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { CountUpModule } from 'ngx-countup';
import { NgApexchartsModule } from 'ng-apexcharts';


import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

@NgModule({
    imports: [
    CommonModule,
    CountUpModule,
    NgbDropdownModule,
    NgApexchartsModule,
    DashboardRoutingModule,
    DashboardComponent
]
})
export class DashboardModule { }
