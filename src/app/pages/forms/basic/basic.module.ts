import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { BasicRoutingModule } from './basic-routing.module';
import { BasicComponent } from './basic.component';



@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    NgbDropdownModule,
    BasicRoutingModule,
    BasicComponent
]
})
export class BasicModule { }
