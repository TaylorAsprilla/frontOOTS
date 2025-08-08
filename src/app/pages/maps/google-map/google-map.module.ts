import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';
import { environment } from 'src/environments/environment';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { GoogleMapRoutingModule } from './google-map-routing.module';
import { GoogleMapComponent } from './google-map.component';



@NgModule({
  declarations: [
    GoogleMapComponent
  ],
  imports: [
    CommonModule,
    PageTitleModule,
    AgmCoreModule.forRoot({
      apiKey: environment.GOOGLE_MAPS_API_KEY
    }),
    GoogleMapRoutingModule
  ]
})
export class GoogleMapModule { }
