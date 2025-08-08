import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { MdiRoutingModule } from './mdi-routing.module';
import { MdiComponent } from './mdi.component';


@NgModule({
  declarations: [
    MdiComponent
  ],
  imports: [
    CommonModule,
    PageTitleModule,
    MdiRoutingModule
  ]
})
export class MdiModule { }
