import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { TwoToneIconRoutingModule } from './two-tone-icon-routing.module';
import { TwoToneIconComponent } from './two-tone-icon.component';


@NgModule({
  declarations: [
    TwoToneIconComponent
  ],
  imports: [
    CommonModule,
    PageTitleModule,
    TwoToneIconRoutingModule
  ]
})
export class TwoToneIconModule { }
