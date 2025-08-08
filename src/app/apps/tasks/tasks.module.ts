import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgbCollapseModule, NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SortablejsModule } from 'ngx-sortablejs';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
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
    PageTitleModule,
    TasksRoutingModule
  ]
})
export class TasksModule { }
