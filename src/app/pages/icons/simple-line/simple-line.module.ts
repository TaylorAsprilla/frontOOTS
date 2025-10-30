import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SimpleLineRoutingModule } from './simple-line-routing.module';
import { SimpleLineComponent } from './simple-line.component';


@NgModule({
    imports: [
    CommonModule,
    SimpleLineRoutingModule,
    SimpleLineComponent
]
})
export class SimpleLineModule { }
