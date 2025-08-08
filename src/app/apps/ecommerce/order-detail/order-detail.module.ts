import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { OrderDetailRoutingModule } from './order-detail-routing.module';
import { OrderDetailComponent } from './order-detail.component';


@NgModule({
    imports: [
    CommonModule,
    OrderDetailRoutingModule,
    OrderDetailComponent
]
})
export class OrderDetailModule { }
