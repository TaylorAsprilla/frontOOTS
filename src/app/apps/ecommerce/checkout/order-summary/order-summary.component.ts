import { Component, OnInit } from '@angular/core';
import { CARTITEMS } from '../../shared/data';
import { CartItem } from '../../shared/ecommerce.model';

@Component({
  selector: 'app-checkout-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss']
})
export class OrderSummaryComponent implements OnInit {

  cartItems: CartItem[] = [];
  total: number = 0;

  constructor () { }

  ngOnInit(): void {
    // get cart items for checkout
    this._fetchData();
    // calulates total amount for billing
    this.caluculateTotal();
  }

  /**
   * fetches cart items
   */
  _fetchData(): void {
    this.cartItems = [...CARTITEMS];
  }

  /**
   * calulates total amount for billing
   */
  caluculateTotal(): void {
    for (const item of CARTITEMS) {
      this.total = this.total + (item.price * item.qty);
    }
  }

}
