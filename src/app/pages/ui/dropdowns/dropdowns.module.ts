import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { DropdownsRoutingModule } from './dropdowns-routing.module';
import { DropdownsComponent } from './dropdowns.component';


@NgModule({
    imports: [
    CommonModule,
    NgbDropdownModule,
    DropdownsRoutingModule,
    DropdownsComponent
]
})
export class DropdownsModule { }
