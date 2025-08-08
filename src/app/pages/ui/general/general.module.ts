import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { GeneralRoutingModule } from './general-routing.module';
import { GeneralComponent } from './general.component';


@NgModule({
    imports: [
    CommonModule,
    NgbPaginationModule,
    GeneralRoutingModule,
    GeneralComponent
]
})
export class GeneralModule { }
