import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Error500twoRoutingModule } from './error500two-routing.module';
import { Error500twoComponent } from './error500two.component';


@NgModule({
    imports: [
    CommonModule,
    Error500twoRoutingModule,
    Error500twoComponent
]
})
export class Error500twoModule { }
