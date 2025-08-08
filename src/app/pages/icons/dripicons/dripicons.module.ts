import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DripiconsRoutingModule } from './dripicons-routing.module';
import { DripiconsComponent } from './dripicons.component';


@NgModule({
    imports: [
    CommonModule,
    DripiconsRoutingModule,
    DripiconsComponent
]
})
export class DripiconsModule { }
