import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApexRoutingModule } from './apex-routing.module';
import { ApexComponent } from './apex.component';
import { NgApexchartsModule } from 'ng-apexcharts';




@NgModule({
    imports: [
    CommonModule,
    NgApexchartsModule,
    ApexRoutingModule,
    ApexComponent
]
})
export class ApexModule { }
