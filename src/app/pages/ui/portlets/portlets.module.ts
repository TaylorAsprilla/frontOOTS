import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { UiModule } from 'src/app/shared/ui/ui.module';
import { PortletsRoutingModule } from './portlets-routing.module';
import { PortletsComponent } from './portlets.component';
import { PortletWithHeaderComponent } from './portlet-with-header/portlet-with-header.component';


@NgModule({
  declarations: [
    PortletsComponent,
    PortletWithHeaderComponent
  ],
  imports: [
    CommonModule,
    NgbCollapseModule,
    UiModule,
    PageTitleModule,
    PortletsRoutingModule
  ]
})
export class PortletsModule { }
