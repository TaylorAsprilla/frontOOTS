import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { WidgetModule } from 'src/app/shared/widget/widget.module';
import { UiModule } from 'src/app/shared/ui/ui.module';
import { WidgetsRoutingModule } from './widgets-routing.module';
import { WidgetsComponent } from './widgets.component';




@NgModule({
  declarations: [
    WidgetsComponent
  ],
  imports: [
    CommonModule,
    NgApexchartsModule,
    PageTitleModule,
    UiModule,
    WidgetModule,
    WidgetsRoutingModule
  ]
})
export class WidgetsModule { }
