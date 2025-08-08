import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Select2Module } from 'ng-select2-component';
import { NgbDatepickerModule, NgbTimepickerModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

import { AdvancedRoutingModule } from './advanced-routing.module';
import { AdvancedComponent } from './advanced.component';



@NgModule({
  declarations: [
    AdvancedComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    Select2Module,
    NgbTypeaheadModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
    AdvancedRoutingModule
]
})
export class AdvancedModule { }
