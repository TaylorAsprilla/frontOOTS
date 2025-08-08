import { Component, OnInit } from '@angular/core';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { CARTITEMS } from '../shared/data';
import { CartItem, CartSummary } from '../shared/ecommerce.model';

@Component({
  selector: 'app-ecommerce-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  cartItems: CartItem[] = [];
  cartSummary!: CartSummary;
  constructor () { }

  ngOnInit(): void {

    this.pageTitle = [{ label: 'Ecommerce', path: '/' }, { label: 'Shopping Cart', path: '/', active: true }];

    // get cart items
    this._fetchData();

    // calculate initial cart summary
    this.calculateSummary();
  }

  /**
   * fetches cart items
   */
  _fetchData(): void {
    this.cartItems = [...CARTITEMS];
  }

  /**
   * calulates cart summary
   */
  calculateSummary(): void {
    let grand_total: number = 0;
    let item: CartItem;
    for (item of this.cartItems) {
      grand_total = grand_total + item.total;
    }

    this.cartSummary = {
      grand_total: grand_total,
      discount: this.cartItems.length ? 157.11 : 0,
      shipping_charge: this.cartItems.length ? 25 : 0,
      tax: this.cartItems.length ? 19.22 : 0,
    }
    this.cartSummary.net_total = (this.cartSummary.grand_total! - (this.cartSummary.discount ? this.cartSummary.discount : 0) + this.cartSummary.shipping_charge! + this.cartSummary.tax!);
  }

  /**
 * on change of quantity of any cart item
 * @param item cart item
 */
  onQuantityChange(item: CartItem): void {
    item.total = item.qty * item.price;
    const items = [...this.cartItems];
    const idx = items.findIndex(i => i['id'] === item['id']);
    items[idx].total = items[idx].price * items[idx].qty;
    this.cartItems = items;
    this.calculateSummary();
  }

  /**
   * remove item from cart
   * @param item cart item to be removed
   */
  onItemRemove(item: CartItem): void {
    const index = this.cartItems.indexOf(item);
    if (index > -1) {
      this.cartItems.splice(index, 1);
    }
    // update cart summary
    this.calculateSummary();
  }

}
