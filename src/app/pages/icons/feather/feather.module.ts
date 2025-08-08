import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeatherRoutingModule } from './feather-routing.module';
import { FeatherComponent } from './feather.component';


@NgModule({
    imports: [
    CommonModule,
    FeatherRoutingModule,
    FeatherComponent
]
})
export class FeatherModule { }
