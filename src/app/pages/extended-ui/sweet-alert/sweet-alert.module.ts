import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { SweetAlertRoutingModule } from './sweet-alert-routing.module';
import { SweetAlertComponent } from './sweet-alert.component';


@NgModule({
  declarations: [
    SweetAlertComponent
  ],
  imports: [
    CommonModule,
    SweetAlert2Module,
    PageTitleModule,
    SweetAlertRoutingModule
  ]
})
export class SweetAlertModule { }
