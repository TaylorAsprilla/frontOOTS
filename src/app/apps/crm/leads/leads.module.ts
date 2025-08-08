import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { LeadsRoutingModule } from './leads-routing.module';
import { LeadsComponent } from './leads.component';


@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModalModule,
    NgApexchartsModule,
    LeadsRoutingModule,
    LeadsComponent
]
})
export class LeadsModule { }
