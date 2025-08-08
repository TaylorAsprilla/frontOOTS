import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApexRoutingModule } from './apex-routing.module';
import { ApexComponent } from './apex.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { UiModule } from 'src/app/shared/ui/ui.module';


@NgModule({
  declarations: [
    ApexComponent
  ],
  imports: [
    CommonModule,
    NgApexchartsModule,
    PageTitleModule,
    UiModule,
    ApexRoutingModule
  ]
})
export class ApexModule { }
