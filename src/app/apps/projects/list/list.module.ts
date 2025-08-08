import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule, NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { ListRoutingModule } from './list-routing.module';
import { ListComponent } from './list.component';



@NgModule({
    imports: [
    CommonModule,
    NgbTooltipModule,
    NgbDropdownModule,
    NgbProgressbarModule,
    ListRoutingModule,
    ListComponent
]
})
export class ListModule { }
