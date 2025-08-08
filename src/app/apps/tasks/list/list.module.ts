import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { NgbCollapseModule, NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SortablejsModule } from 'ngx-sortablejs';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { ListRoutingModule } from './list-routing.module';
import { ListComponent } from './list.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';


@NgModule({
  declarations: [
    ListComponent,
    TaskDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    QuillModule,
    NgbDropdownModule,
    NgbCollapseModule,
    NgbTooltipModule,
    SortablejsModule,
    PageTitleModule,
    ListRoutingModule
  ]
})
export class ListModule { }
