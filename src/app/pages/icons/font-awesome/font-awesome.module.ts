import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { FontAwesomeRoutingModule } from './font-awesome-routing.module';
import { FontAwesomeComponent } from './font-awesome.component';


@NgModule({
  declarations: [
    FontAwesomeComponent
  ],
  imports: [
    CommonModule,
    PageTitleModule,
    FontAwesomeRoutingModule
  ]
})
export class FontAwesomeModule { }
