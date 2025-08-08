import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { FeatherRoutingModule } from './feather-routing.module';
import { FeatherComponent } from './feather.component';


@NgModule({
  declarations: [
    FeatherComponent
  ],
  imports: [
    CommonModule,
    PageTitleModule,
    FeatherRoutingModule
  ]
})
export class FeatherModule { }
