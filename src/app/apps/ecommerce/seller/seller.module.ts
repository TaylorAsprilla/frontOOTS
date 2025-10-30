import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



import { SellerRoutingModule } from './seller-routing.module';
import { SellerComponent } from './seller.component';


@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    SellerRoutingModule,
    SellerComponent
]
})
export class SellerModule { }
