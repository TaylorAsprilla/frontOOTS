import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbNavModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';


import { ProductDetailRoutingModule } from './product-detail-routing.module';
import { ProductDetailComponent } from './product-detail.component';


@NgModule({
    imports: [
    CommonModule,
    NgbProgressbarModule,
    NgbNavModule,
    ProductDetailRoutingModule,
    ProductDetailComponent
]
})
export class ProductDetailModule { }
