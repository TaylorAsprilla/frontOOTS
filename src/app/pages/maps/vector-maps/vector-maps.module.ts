import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { WidgetModule } from 'src/app/shared/widget/widget.module';
import { VectorMapsRoutingModule } from './vector-maps-routing.module';
import { VectorMapsComponent } from './vector-maps.component';



@NgModule({
  declarations: [
    VectorMapsComponent
  ],
  imports: [
    CommonModule,
    PageTitleModule,
    WidgetModule,
    VectorMapsRoutingModule
  ]
})
export class VectorMapsModule { }
