import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchResultRoutingModule } from './search-result-routing.module';
import { SearchResultComponent } from './search-result.component';

import { NgbNavModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
    imports: [
    CommonModule,
    NgbNavModule,
    NgbPaginationModule,
    SearchResultRoutingModule,
    SearchResultComponent
]
})
export class SearchResultModule { }
