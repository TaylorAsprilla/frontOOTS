import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDatepickerModule, NgbDropdownModule, NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { NgChartsModule } from 'ng2-charts';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { Select2Module } from 'ng-select2-component';

import { ProjectsRoutingModule } from './projects-routing.module';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    NgChartsModule,
    Select2Module,
    NgbDatepickerModule,
    NgxDropzoneModule,
    NgbDropdownModule,
    NgbTooltipModule,
    NgbProgressbarModule,
    ProjectsRoutingModule
]
})
export class ProjectsModule { }
