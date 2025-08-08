import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbPopoverModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { TooltipsPopoversRoutingModule } from './tooltips-popovers-routing.module';
import { TooltipsPopoversComponent } from './tooltips-popovers.component';


@NgModule({
  declarations: [
    TooltipsPopoversComponent
  ],
  imports: [
    CommonModule,
    NgbPopoverModule,
    NgbTooltipModule,
    PageTitleModule,
    TooltipsPopoversRoutingModule
  ]
})
export class TooltipsPopoversModule { }
