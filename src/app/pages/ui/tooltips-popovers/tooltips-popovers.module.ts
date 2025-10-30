import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbPopoverModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { TooltipsPopoversRoutingModule } from './tooltips-popovers-routing.module';
import { TooltipsPopoversComponent } from './tooltips-popovers.component';


@NgModule({
    imports: [
    CommonModule,
    NgbPopoverModule,
    NgbTooltipModule,
    TooltipsPopoversRoutingModule,
    TooltipsPopoversComponent
]
})
export class TooltipsPopoversModule { }
