import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgbDatepickerModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { DashboardOneRoutingModule } from './dashboard-one-routing.module';
import { DashboardOneComponent } from './dashboard-one.component';


@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    NgbDropdownModule,
    NgbDatepickerModule,
    NgApexchartsModule,
    DashboardOneRoutingModule,
    DashboardOneComponent
]
})
export class DashboardOneModule { }
