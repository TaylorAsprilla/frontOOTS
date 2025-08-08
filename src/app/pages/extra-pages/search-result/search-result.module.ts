import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchResultRoutingModule } from './search-result-routing.module';
import { SearchResultComponent } from './search-result.component';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { NgbNavModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    SearchResultComponent
  ],
  imports: [
    CommonModule,
    PageTitleModule,
    NgbNavModule,
    NgbPaginationModule,
    SearchResultRoutingModule
  ]
})
export class SearchResultModule { }
