import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TypographyRoutingModule } from './typography-routing.module';
import { TypographyComponent } from './typography.component';


@NgModule({
    imports: [
    CommonModule,
    TypographyRoutingModule,
    TypographyComponent
]
})
export class TypographyModule { }
