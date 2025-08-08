import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Column } from 'src/app/shared/advanced-table/advanced-table.component';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { ORDERSLIST } from '../shared/data';
import { Order } from '../shared/ecommerce.model';

@Component({
  selector: 'app-ecommerce-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  orderList: Order[] = [];
  selectAll: boolean = false;
  OrderStatusGroup: string = "All";
  loading: boolean = false;
  columns: Column[] = [];


  @ViewChild('advancedTable') advancedTable: any;

  constructor (private router: Router, private route: ActivatedRoute, private sanitizer: DomSanitizer) { }
  ngOnInit(): void {
    this.pageTitle = [{ label: 'Ecommerce', path: '/' }, { label: 'Orders', path: '/', active: true }];

    // get order list
    this._fetchData();

    // initialize advance table 
    this.initAdvancedTableData();
  }

  /**
   *  fetches order list
   */
  _fetchData(): void {
    this.orderList = ORDERSLIST;
  }


  ngAfterViewInit(): void {
  }

  // initialize advance table columns
  initAdvancedTableData(): void {
    this.columns = [
      {
        name: 'order_id',
        label: 'Order ID',
        formatter: this.orderIDFormatter.bind(this)
      },
      {
        name: 'products',
        label: 'Products',
        formatter: this.productsFormatter.bind(this),
      },
      {
        name: 'order_date',
        label: 'Date',
        formatter: this.orderDateFormatter.bind(this)
      },
      {
        name: 'payment_status',
        label: 'Payment Status',
        formatter: this.ordePaymentStatusFormatter.bind(this)
      },
      {
        name: 'total',
        label: 'Total',
        formatter: (order: Order) => order.total
      }, {
        name: 'payment_method',
        label: 'Payment Method',
        formatter: (order: Order) => order.payment_method
      },
      {
        name: 'order_status',
        label: 'Order Status',
        formatter: this.orderStatusFormatter.bind(this)
      },
      {
        name: 'Action',
        label: 'Action',
        sort: false,
        formatter: this.orderActionFormatter.bind(this)
      }];

  }


  /**
   *  handles operations that need to be performed after loading table
   */
  handleTableLoad(event: any): void {
    // product cell
    document.querySelectorAll('.order').forEach((e) => {
      e.addEventListener("click", () => {
        this.router.navigate(['../order/details'], { relativeTo: this.route, queryParams: { id: e.id } })
      });
    })
  }

  // formats order ID cell
  orderIDFormatter(order: Order): any {
    return this.sanitizer.bypassSecurityTrustHtml(
      `<a href="javascript:void(0)" class="order text-body fw-bold" id="${order.id}">#UB${order.order_id}</a> `
    );
  }

  //formats product cell
  productsFormatter(order: Order): any {
    let products: string = ``;
    for (let i = 0; i < order.products.length; i++) {
      products += `<a href="javascript:void(0)"><img src="${order.products[i]}" alt="product-img" height="32" /></a>`
    }
    return this.sanitizer.bypassSecurityTrustHtml(products);
  }

  // formats order date cell
  orderDateFormatter(order: Order): any {
    return this.sanitizer.bypassSecurityTrustHtml(
      `${order.order_date} <small class="text-muted">${order.order_time}</small>`
    );
  }

  // formats payment status cell
  ordePaymentStatusFormatter(order: Order): any {
    if (order.payment_status == "Paid") {
      return this.sanitizer.bypassSecurityTrustHtml(
        `<h5><span class="badge bg-soft-success text-success"><i class="mdi mdi-bitcoin"></i> Paid</span></h5>`
      );
    }
    else if (order.payment_status == "Awaiting Authorization") {
      return this.sanitizer.bypassSecurityTrustHtml(
        `<h5><span class="badge bg-soft-warning text-warning"><i class="mdi mdi-timer-sand"></i> Awaiting Authorization</span></h5>`
      );
    }
    else if (order.payment_status == "Payment Failed") {
      return this.sanitizer.bypassSecurityTrustHtml(
        ` <h5><span class="badge bg-soft-danger text-danger"><i class="mdi mdi-cancel"></i> Payment Failed</span></h5>`
      );
    }
    else {
      return this.sanitizer.bypassSecurityTrustHtml(
        `<h5><span class="badge bg-soft-info text-info"><i class="mdi mdi-cash"></i> Cash On Delivery</span></h5>`
      );
    }

  }

  // formats order status
  orderStatusFormatter(order: Order): any {
    if (order.order_status == "Processing") {
      return this.sanitizer.bypassSecurityTrustHtml(
        `<h5><span class="badge bg-warning">Processing</span></h5>`
      );
    }
    else if (order.order_status == "Delivered") {
      return this.sanitizer.bypassSecurityTrustHtml(
        `<h5><span class="badge bg-success">Delivered</span></h5>`
      );
    }
    else if (order.order_status == "Shipped") {
      return this.sanitizer.bypassSecurityTrustHtml(
        `<h5><span class="badge bg-info">Shipped</span></h5>`
      );
    }
    else {
      return this.sanitizer.bypassSecurityTrustHtml(
        `<h5><span class="badge bg-danger">Cancelled</span></h5>`
      );
    }

  }

  // action cell formatter
  orderActionFormatter(order: Order): any {
    return this.sanitizer.bypassSecurityTrustHtml(
      `<a href="javascript:void(0);" class="action-icon"> <i class="mdi mdi-eye"></i></a>
           <a href="javascript:void(0);" class="action-icon"> <i class="mdi mdi-square-edit-outline"></i></a>
           <a href="javascript:void(0);" class="action-icon"> <i class="mdi mdi-delete"></i></a>`
    )
  }


  /**
 * Match table data with search input
 * @param row Table row
 * @param term Search the value
 */
  matches(row: Order, term: string) {
    return row.order_id?.toLowerCase().includes(term)
      || row.order_date?.toLowerCase().includes(term)
      || row.total?.toLowerCase().includes(term)
      || row.payment_method?.toLowerCase().includes(term)
      || row.payment_status?.toLowerCase().includes(term)
      || row.order_status?.toLocaleLowerCase().includes(term);
  }

  /**
   * Search Method
  */
  searchData(searchTerm: string): void {
    if (searchTerm === '') {
      this._fetchData();
    }
    else {
      let updatedData = ORDERSLIST;
      //  filter
      updatedData = updatedData.filter(product => this.matches(product, searchTerm));
      this.orderList = updatedData;
    }

  }



  /**
   * change order status group
   * @param OrderStatusGroup order status
   */
  changeOrderStatusGroup(OrderStatusGroup: string): void {
    this.loading = true;
    let updatedData = ORDERSLIST;
    //  filter
    updatedData = OrderStatusGroup === "All" ? ORDERSLIST : [...ORDERSLIST].filter((o) => o.payment_status?.includes(OrderStatusGroup))
    this.orderList = updatedData;
    setTimeout(() => {
      this.loading = false;
    }, 400);
  }


}
