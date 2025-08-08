import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { TypographyRoutingModule } from './typography-routing.module';
import { TypographyComponent } from './typography.component';


@NgModule({
  declarations: [
    TypographyComponent
  ],
  imports: [
    CommonModule,
    PageTitleModule,
    TypographyRoutingModule
  ]
})
export class TypographyModule { }
