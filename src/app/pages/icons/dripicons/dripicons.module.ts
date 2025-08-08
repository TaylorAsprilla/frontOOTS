import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { DripiconsRoutingModule } from './dripicons-routing.module';
import { DripiconsComponent } from './dripicons.component';


@NgModule({
  declarations: [
    DripiconsComponent
  ],
  imports: [
    CommonModule,
    PageTitleModule,
    DripiconsRoutingModule
  ]
})
export class DripiconsModule { }
