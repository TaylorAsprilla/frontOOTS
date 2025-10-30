import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MdiRoutingModule } from './mdi-routing.module';
import { MdiComponent } from './mdi.component';


@NgModule({
    imports: [
    CommonModule,
    MdiRoutingModule,
    MdiComponent
]
})
export class MdiModule { }
