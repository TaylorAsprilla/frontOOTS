import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Column } from 'src/app/shared/advanced-table/advanced-table.component';
import { SortEvent } from 'src/app/shared/advanced-table/sortable.directive';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { CUSTOMERSLIST } from '../shared/data';
import { Customer } from '../shared/ecommerce.model';

@Component({
  selector: 'app-ecommerce-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  customerList: Customer[] = [];
  loading: boolean = false;
  selectAll: boolean = false;
  pageSizeOptions: number[] = [5, 10, 20];
  columns: Column[] = [];

  @ViewChild('advancedTable') advancedTable: any;
  constructor (private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Ecommerce', path: '/' }, { label: 'Customers', path: '/', active: true }];
    this._fetchData();
    // initialize advance table 
    this.initAdvancedTableData();
  }

  /**
   * fetch data
   */
  _fetchData(): void {
    this.customerList = CUSTOMERSLIST;
  }

  /**
 * initialize advance table columns
 */
  initAdvancedTableData(): void {
    this.columns = [
      {
        name: 'name',
        label: 'Customers',
        formatter: this.customerNameFormatter.bind(this)
      },
      {
        name: 'phone',
        label: 'Phone',
        formatter: (customer: Customer) => customer.phone
      },
      {
        name: 'balance',
        label: 'Balance',
        formatter: (customer: Customer) => customer.balance
      },
      {
        name: 'orders',
        label: 'Orders',
        formatter: (customer: Customer) => customer.orders
      },
      {
        name: 'last_order',
        label: 'Last Order',
        formatter: this.customerLastOrderFormatter.bind(this)
      },
      {
        name: 'status',
        label: 'Status',
        formatter: this.customerStatusFormatter.bind(this)
      },
      {
        name: 'Action',
        label: 'Action',
        width: 75,
        formatter: this.customerActionFormatter.bind(this),
        sort: false
      }]
  }

  // formats name cell
  customerNameFormatter(customer: Customer): any {
    return this.sanitizer.bypassSecurityTrustHtml(
      `
      <div class="table-user">
      <img src="${customer.avatar}" alt="table-user" class="me-2 rounded-circle">
       <a href="javascript:void(0);" class="text-body fw-semibold">${customer.name}</a>
       </div>
      `
    );
  }

  //formats last order cell
  customerLastOrderFormatter(customer: Customer): any {
    return this.sanitizer.bypassSecurityTrustHtml(
      `  ${customer.last_order.date} <small class="text-muted">${customer.last_order.time}</small>`
    );
  }

  // formats customer status
  customerStatusFormatter(customer: Customer): any {
    if (customer.status == "Active") {
      return this.sanitizer.bypassSecurityTrustHtml(
        `<span class="badge badge-soft-success">Active</span>`
      );
    }
    else {
      return this.sanitizer.bypassSecurityTrustHtml(
        `<span class="badge badge-soft-danger">Blocked</span>`
      );
    }

  }

  // action cell formatter
  customerActionFormatter(): any {
    return this.sanitizer.bypassSecurityTrustHtml(
      `  <a href="javascript:void(0);" class="action-icon"> <i class="mdi mdi-square-edit-outline"></i></a>
           <a href="javascript:void(0);" class="action-icon"> <i class="mdi mdi-delete"></i></a>`
    );
  }

  /**
   * compares two cell value
   */
  compare(v1: any, v2: any): number {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }

  /**
   * Sort the table data
   * @param event column name,direction
   */
  sort(event: SortEvent): void {
    if (event.direction === '') {
      this.customerList = CUSTOMERSLIST;
    } else {
      this.customerList = [...this.customerList].sort((a, b) => {
        let res: any;
        if (event.column === 'last_order') {
          res = this.compare(a['last_order']['date'], b['last_order']['date']);
        }
        else {
          res = this.compare(a[event.column], b[event.column]);
        }

        return event.direction === 'asc' ? res : -res;
      });
    }
  }

  /**
 * Match table data with search input
 * @param row Table row
 * @param term Search the value
 */
  matches(row: Customer, term: string) {
    return row.name?.toLowerCase().includes(term)
      || row.phone?.toLowerCase().includes(term)
      || String(row.orders).toLowerCase().includes(term)
      || String(row.balance).toLowerCase().includes(term)
      || row.status?.toLocaleLowerCase().includes(term);
  }

  /**
   * Search Method
  */
  searchData(searchTerm: string): void {
    if (searchTerm === '') {
      this._fetchData();
    }
    else {
      let updatedData = CUSTOMERSLIST;
      //  filter
      updatedData = updatedData.filter(customer => this.matches(customer, searchTerm));
      this.customerList = updatedData;
    }

  }
}
