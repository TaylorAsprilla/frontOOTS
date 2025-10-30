import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { VectorMapsRoutingModule } from './vector-maps-routing.module';
import { VectorMapsComponent } from './vector-maps.component';



@NgModule({
    imports: [
    CommonModule,
    VectorMapsRoutingModule,
    VectorMapsComponent
]
})
export class VectorMapsModule { }
