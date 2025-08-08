import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { LeadsRoutingModule } from './leads-routing.module';
import { LeadsComponent } from './leads.component';


@NgModule({
  declarations: [
    LeadsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModalModule,
    NgApexchartsModule,
    PageTitleModule,
    LeadsRoutingModule
  ]
})
export class LeadsModule { }
