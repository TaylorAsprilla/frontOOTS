import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';


import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';




@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    NgbPaginationModule,
    ProductsRoutingModule,
    ProductsComponent
]
})
export class ProductsModule { }
