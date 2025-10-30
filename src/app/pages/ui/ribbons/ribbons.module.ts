import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RibbonsRoutingModule } from './ribbons-routing.module';
import { RibbonsComponent } from './ribbons.component';


@NgModule({
    imports: [
    CommonModule,
    RibbonsRoutingModule,
    RibbonsComponent
]
})
export class RibbonsModule { }
