import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbAccordionModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { ModalsRoutingModule } from './modals-routing.module';
import { ModalsComponent } from './modals.component';


@NgModule({
    imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbAccordionModule,
    NgbModalModule,
    ModalsRoutingModule,
    ModalsComponent
]
})
export class ModalsModule { }
