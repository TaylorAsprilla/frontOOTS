import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SortablejsModule } from 'ngx-sortablejs';

import { KanbanRoutingModule } from './kanban-routing.module';
import { KanbanComponent } from './kanban.component';


@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    NgbDropdownModule,
    NgbTooltipModule,
    SortablejsModule,
    KanbanRoutingModule,
    KanbanComponent
]
})
export class KanbanModule { }
