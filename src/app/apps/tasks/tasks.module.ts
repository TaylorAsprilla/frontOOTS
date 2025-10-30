import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgbCollapseModule, NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SortablejsModule } from 'ngx-sortablejs';

import { TasksRoutingModule } from './tasks-routing.module';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    QuillModule,
    NgxDropzoneModule,
    NgbDropdownModule,
    NgbCollapseModule,
    NgbTooltipModule,
    SortablejsModule,
    TasksRoutingModule
]
})
export class TasksModule { }
