import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DragDropRoutingModule } from './drag-drop-routing.module';
import { DragDropComponent } from './drag-drop.component';
import { SortablejsModule } from 'ngx-sortablejs';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';


@NgModule({
  declarations: [
    DragDropComponent
  ],
  imports: [
    CommonModule,
    SortablejsModule,
    PageTitleModule,
    DragDropRoutingModule
  ]
})
export class DragDropModule { }
