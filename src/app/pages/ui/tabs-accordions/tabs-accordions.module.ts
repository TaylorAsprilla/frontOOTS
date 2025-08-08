import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbAccordionModule, NgbCollapseModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { TabsAccordionsRoutingModule } from './tabs-accordions-routing.module';
import { TabsAccordionsComponent } from './tabs-accordions.component';


@NgModule({
  declarations: [
    TabsAccordionsComponent
  ],
  imports: [
    CommonModule,
    NgbAccordionModule,
    NgbCollapseModule,
    NgbNavModule,
    PageTitleModule,
    TabsAccordionsRoutingModule
  ]
})
export class TabsAccordionsModule { }
