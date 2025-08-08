import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { ShoppingCartRoutingModule } from './shopping-cart-routing.module';
import { ShoppingCartComponent } from './shopping-cart.component';



@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    NgbAlertModule,
    ShoppingCartRoutingModule,
    ShoppingCartComponent
]
})
export class ShoppingCartModule { }
