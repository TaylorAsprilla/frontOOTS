import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { SimpleLineRoutingModule } from './simple-line-routing.module';
import { SimpleLineComponent } from './simple-line.component';


@NgModule({
  declarations: [
    SimpleLineComponent
  ],
  imports: [
    CommonModule,
    PageTitleModule,
    SimpleLineRoutingModule
  ]
})
export class SimpleLineModule { }
