import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpinnersRoutingModule } from './spinners-routing.module';
import { SpinnersComponent } from './spinners.component';


@NgModule({
    imports: [
    CommonModule,
    SpinnersRoutingModule,
    SpinnersComponent
]
})
export class SpinnersModule { }
