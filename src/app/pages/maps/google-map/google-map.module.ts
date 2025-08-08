import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';
import { environment } from 'src/environments/environment';

import { GoogleMapRoutingModule } from './google-map-routing.module';
import { GoogleMapComponent } from './google-map.component';



@NgModule({
    imports: [
    CommonModule,
    AgmCoreModule.forRoot({
        apiKey: environment.GOOGLE_MAPS_API_KEY
    }),
    GoogleMapRoutingModule,
    GoogleMapComponent
]
})
export class GoogleMapModule { }
