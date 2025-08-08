import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { WeatherRoutingModule } from './weather-routing.module';
import { WeatherComponent } from './weather.component';



@NgModule({
    imports: [
    CommonModule,
    NgbAlertModule,
    WeatherRoutingModule,
    WeatherComponent
]
})
export class WeatherModule { }
