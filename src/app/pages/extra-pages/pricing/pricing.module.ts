import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { WidgetModule } from 'src/app/shared/widget/widget.module';
import { PricingRoutingModule } from './pricing-routing.module';
import { PricingComponent } from './pricing.component';

@NgModule({
  declarations: [
    PricingComponent
  ],
  imports: [
    CommonModule,
    WidgetModule,
    PageTitleModule,
    PricingRoutingModule
  ]
})
export class PricingModule { }
