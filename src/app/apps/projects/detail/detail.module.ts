import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';


import { DetailRoutingModule } from './detail-routing.module';
import { DetailComponent } from './detail.component';



@NgModule({
  declarations: [
    DetailComponent
  ],
  imports: [
    CommonModule,
    NgbTooltipModule,
    NgbDropdownModule,
    NgChartsModule,
    DetailRoutingModule
]
})
export class DetailModule { }
