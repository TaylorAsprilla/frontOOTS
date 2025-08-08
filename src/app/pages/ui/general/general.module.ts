import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { GeneralRoutingModule } from './general-routing.module';
import { GeneralComponent } from './general.component';


@NgModule({
  declarations: [
    GeneralComponent
  ],
  imports: [
    CommonModule,
    NgbPaginationModule,
    PageTitleModule,
    GeneralRoutingModule
  ]
})
export class GeneralModule { }
