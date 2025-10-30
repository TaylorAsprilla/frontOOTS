import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BasicTableRoutingModule } from './basic-table-routing.module';
import { BasicTableComponent } from './basic-table.component';


@NgModule({
    imports: [
    CommonModule,
    BasicTableRoutingModule,
    BasicTableComponent
]
})
export class BasicTableModule { }
