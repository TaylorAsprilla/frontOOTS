import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerComponent } from './customer.component';



@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    CustomerRoutingModule,
    CustomerComponent
]
})
export class CustomerModule { }
