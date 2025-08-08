import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { Select2Module } from 'ng-select2-component';
import { NgxDropzoneModule } from 'ngx-dropzone';

import { CreateRoutingModule } from './create-routing.module';
import { CreateComponent } from './create.component';




@NgModule({
  declarations: [
    CreateComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbTooltipModule,
    Select2Module,
    NgxDropzoneModule,
    NgbDatepickerModule,
    CreateRoutingModule
]
})
export class CreateModule { }
