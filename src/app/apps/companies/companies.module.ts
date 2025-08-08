import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { CompaniesRoutingModule } from './companies-routing.module';
import { CompaniesComponent } from './companies.component';

@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    NgbPaginationModule,
    CompaniesRoutingModule,
    CompaniesComponent
]
})
export class CompaniesModule { }
