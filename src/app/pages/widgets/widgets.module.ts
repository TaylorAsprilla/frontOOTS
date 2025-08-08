import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';



import { WidgetsRoutingModule } from './widgets-routing.module';
import { WidgetsComponent } from './widgets.component';




@NgModule({
    imports: [
    CommonModule,
    NgApexchartsModule,
    WidgetsRoutingModule,
    WidgetsComponent
]
})
export class WidgetsModule { }
