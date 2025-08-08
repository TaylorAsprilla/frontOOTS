import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';


import { PortletsRoutingModule } from './portlets-routing.module';
import { PortletsComponent } from './portlets.component';
import { PortletWithHeaderComponent } from './portlet-with-header/portlet-with-header.component';


@NgModule({
    imports: [
    CommonModule,
    NgbCollapseModule,
    PortletsRoutingModule,
    PortletsComponent,
    PortletWithHeaderComponent
]
})
export class PortletsModule { }
