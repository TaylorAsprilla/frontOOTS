import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetModule } from 'src/app/shared/widget/widget.module';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { FaqRoutingModule } from './faq-routing.module';
import { FaqComponent } from './faq.component';



@NgModule({
  declarations: [
    FaqComponent
  ],
  imports: [
    CommonModule,
    PageTitleModule,
    WidgetModule,
    FaqRoutingModule
  ]
})
export class FaqModule { }
