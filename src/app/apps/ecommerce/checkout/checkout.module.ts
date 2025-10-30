import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Select2Module } from 'ng-select2-component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';


import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutComponent } from './checkout.component';
import { BillingComponent } from './billing/billing.component';
import { OrderSummaryComponent } from './order-summary/order-summary.component';
import { PaymentComponent } from './payment/payment.component';
import { ShippingComponent } from './shipping/shipping.component';


@NgModule({
  declarations: [
    CheckoutComponent,
    BillingComponent,
    ShippingComponent,
    PaymentComponent,
    OrderSummaryComponent
  ],
  imports: [
    CommonModule,
    NgbNavModule,
    Select2Module,
    CheckoutRoutingModule
]
})
export class CheckoutModule { }
