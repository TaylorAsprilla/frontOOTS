import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbAccordionModule, NgbCollapseModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { TabsAccordionsRoutingModule } from './tabs-accordions-routing.module';
import { TabsAccordionsComponent } from './tabs-accordions.component';


@NgModule({
    imports: [
    CommonModule,
    NgbAccordionModule,
    NgbCollapseModule,
    NgbNavModule,
    TabsAccordionsRoutingModule,
    TabsAccordionsComponent
]
})
export class TabsAccordionsModule { }
