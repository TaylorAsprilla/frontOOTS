import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DragDropRoutingModule } from './drag-drop-routing.module';
import { DragDropComponent } from './drag-drop.component';
import { SortablejsModule } from 'ngx-sortablejs';



@NgModule({
    imports: [
    CommonModule,
    SortablejsModule,
    DragDropRoutingModule,
    DragDropComponent
]
})
export class DragDropModule { }
