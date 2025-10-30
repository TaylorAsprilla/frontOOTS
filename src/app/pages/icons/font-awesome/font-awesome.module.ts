import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeRoutingModule } from './font-awesome-routing.module';
import { FontAwesomeComponent } from './font-awesome.component';


@NgModule({
    imports: [
    CommonModule,
    FontAwesomeRoutingModule,
    FontAwesomeComponent
]
})
export class FontAwesomeModule { }
