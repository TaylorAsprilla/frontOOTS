import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Error404twoRoutingModule } from './error404two-routing.module';
import { Error404twoComponent } from './error404two.component';


@NgModule({
    imports: [
    CommonModule,
    Error404twoRoutingModule,
    Error404twoComponent
]
})
export class Error404twoModule { }
