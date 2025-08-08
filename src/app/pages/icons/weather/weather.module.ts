import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { WeatherRoutingModule } from './weather-routing.module';
import { WeatherComponent } from './weather.component';



@NgModule({
  declarations: [
    WeatherComponent
  ],
  imports: [
    CommonModule,
    NgbAlertModule,
    PageTitleModule,
    WeatherRoutingModule
  ]
})
export class WeatherModule { }
