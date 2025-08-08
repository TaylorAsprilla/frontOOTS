import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarRoutingModule } from './calendar-routing.module';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { CalendarComponent } from './calendar.component';
import { CalendarEventComponent } from './event/event.component';



@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    FullCalendarModule,
    NgbModalModule,
    CalendarRoutingModule,
    CalendarComponent,
    CalendarEventComponent
]
})
export class CalendarModule { }
