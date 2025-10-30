import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThemifyRoutingModule } from './themify-routing.module';
import { ThemifyComponent } from './themify.component';


@NgModule({
    imports: [
    CommonModule,
    ThemifyRoutingModule,
    ThemifyComponent
]
})
export class ThemifyModule { }
