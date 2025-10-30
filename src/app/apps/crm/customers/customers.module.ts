import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';


import { CustomersRoutingModule } from './customers-routing.module';
import { CustomersComponent } from './customers.component';



@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModalModule,
    CustomersRoutingModule,
    CustomersComponent
]
})
export class CustomersModule { }
