import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { ORDERSLIST } from '../shared/data';
import { Order, OrderDetails } from '../shared/ecommerce.model';

@Component({
  selector: 'app-ecommerce-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];

  selectedOrder!: Order;
  orderDetails!: OrderDetails;

  constructor (private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Ecommerce', path: '/' }, { label: 'Order Details', path: '/', active: true }];

    this.route.queryParams.subscribe(params => {
      if (params && params.hasOwnProperty('id')) {
        this.selectedOrder = ORDERSLIST.filter(x => String(x.id) === params['id'])[0];
      } else {
        this.selectedOrder = ORDERSLIST[0];
      }
    });
    // get order details
    this._fetchData();
  }

  /**
   * fetches order details
   */
  _fetchData(): void {
    this.orderDetails = {
      id: this.selectedOrder.order_id!,
      order_status: this.selectedOrder.order_status,
      tracking_id: '894152012012',
      items: [
        { id: 1, name: 'Polo Navy blue T-shirt', image: 'assets/images/products/product-1.png', quantity: 1, price: 39, total: 39 },
        { id: 2, name: 'Red Hoodie for men', image: 'assets/images/products/product-2.png', quantity: 2, price: 46, total: 92 },
        { id: 3, name: 'Red Hoodie for men', image: 'assets/images/products/product-3.png', quantity: 1, price: 46, total: 46 },
      ],
      shipping: {
        provider: 'Stanley Jones',
        address_1: '795 Folsom Ave, Suite 600',
        address_2: 'San Francisco, CA 94107',
        phone: '(123) 456-7890 ',
        mobile: '(+01) 12345 67890',
      },
      billing: {
        type: this.selectedOrder.payment_method!,
        provider: 'Visa ending in 2851',
        valid: '02/2020',
      },
      delivery: {
        provider: 'UPS Delivery',
        order_id: this.selectedOrder.order_id!,
        payment_mode: this.selectedOrder.payment_method!,
      },
    };
  }
}
