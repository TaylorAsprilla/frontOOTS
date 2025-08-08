import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TwoToneIconRoutingModule } from './two-tone-icon-routing.module';
import { TwoToneIconComponent } from './two-tone-icon.component';


@NgModule({
    imports: [
    CommonModule,
    TwoToneIconRoutingModule,
    TwoToneIconComponent
]
})
export class TwoToneIconModule { }
