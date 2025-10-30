import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { SweetAlertRoutingModule } from './sweet-alert-routing.module';
import { SweetAlertComponent } from './sweet-alert.component';


@NgModule({
    imports: [
    CommonModule,
    SweetAlert2Module,
    SweetAlertRoutingModule,
    SweetAlertComponent
]
})
export class SweetAlertModule { }
