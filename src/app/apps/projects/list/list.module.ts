import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule, NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { ListRoutingModule } from './list-routing.module';
import { ListComponent } from './list.component';



@NgModule({
  declarations: [
    ListComponent
  ],
  imports: [
    CommonModule,
    NgbTooltipModule,
    NgbDropdownModule,
    NgbProgressbarModule,
    PageTitleModule,
    ListRoutingModule
  ]
})
export class ListModule { }
