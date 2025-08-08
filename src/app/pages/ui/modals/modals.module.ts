import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbAccordionModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { ModalsRoutingModule } from './modals-routing.module';
import { ModalsComponent } from './modals.component';


@NgModule({
  declarations: [
    ModalsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbAccordionModule,
    NgbModalModule,
    PageTitleModule,
    ModalsRoutingModule
  ]
})
export class ModalsModule { }
