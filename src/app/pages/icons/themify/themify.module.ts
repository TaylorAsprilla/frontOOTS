import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { ThemifyRoutingModule } from './themify-routing.module';
import { ThemifyComponent } from './themify.component';


@NgModule({
  declarations: [
    ThemifyComponent
  ],
  imports: [
    CommonModule,
    PageTitleModule,
    ThemifyRoutingModule
  ]
})
export class ThemifyModule { }
