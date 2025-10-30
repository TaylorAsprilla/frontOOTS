import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { AdvanceRoutingModule } from './advance-routing.module';
import { AdvanceComponent } from './advance.component';



@NgModule({
    imports: [
    CommonModule,
    AdvanceRoutingModule,
    AdvanceComponent
]
})
export class AdvanceModule { }
