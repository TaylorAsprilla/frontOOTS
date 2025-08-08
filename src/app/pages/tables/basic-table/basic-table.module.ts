import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { BasicTableRoutingModule } from './basic-table-routing.module';
import { BasicTableComponent } from './basic-table.component';


@NgModule({
  declarations: [
    BasicTableComponent
  ],
  imports: [
    CommonModule,
    PageTitleModule,
    BasicTableRoutingModule
  ]
})
export class BasicTableModule { }
