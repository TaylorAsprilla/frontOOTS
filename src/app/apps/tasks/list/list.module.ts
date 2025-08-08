import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { NgbCollapseModule, NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SortablejsModule } from 'ngx-sortablejs';

import { ListRoutingModule } from './list-routing.module';
import { ListComponent } from './list.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';


@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    QuillModule,
    NgbDropdownModule,
    NgbCollapseModule,
    NgbTooltipModule,
    SortablejsModule,
    ListRoutingModule,
    ListComponent,
    TaskDetailComponent
]
})
export class ListModule { }
