import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiModule } from 'src/app/shared/ui/ui.module';
import { UpcomingRoutingModule } from './upcoming-routing.module';
import { UpcomingComponent } from './upcoming.component';


@NgModule({
  declarations: [
    UpcomingComponent,
  ],
  imports: [
    CommonModule,
    UiModule,
    UpcomingRoutingModule
  ]
})
export class UpcomingModule { }
