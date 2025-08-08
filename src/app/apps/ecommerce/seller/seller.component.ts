import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Column } from 'src/app/shared/advanced-table/advanced-table.component';
import { SortEvent } from 'src/app/shared/advanced-table/sortable.directive';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { SELLERSLIST } from '../shared/data';
import { Seller } from '../shared/ecommerce.model';

@Component({
  selector: 'app-ecommerce-seller',
  templateUrl: './seller.component.html',
  styleUrls: ['./seller.component.scss']
})
export class SellerComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  loading: boolean = false;
  selectAll: boolean = false;
  sellerList: Seller[] = [];
  columns: Column[] = [];

  @ViewChild('advancedTable') advancedTable: any;

  constructor (private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Ecommerce', path: '/' }, { label: 'Sellers', path: '/', active: true }];

    // get customer data
    this._fetchData();

    // initialize advance table 
    this.initAdvancedTableData();
  }

  /**
   * fetches customer data
   */
  _fetchData(): void {
    this.sellerList = SELLERSLIST;
  }



  /**
   *  initialize advance table columns
   */
  initAdvancedTableData(): void {
    this.columns = [
      {
        name: 'name',
        label: 'Owner Name',
        formatter: this.sellerNameFormatter.bind(this)
      },
      {
        name: 'store',
        label: 'Store Name',
        formatter: (seller: Seller) => seller.store
      },
      {
        name: 'ratings',
        label: 'Ratings',
        formatter: (seller: Seller) => seller.ratings
      },
      {
        name: 'product',
        label: 'Products',
        formatter: (seller: Seller) => seller.products
      },
      {
        name: 'balance',
        label: 'Wallet Balance',
        formatter: (seller: Seller) => seller.balance
      },
      {
        name: 'created_on',
        label: 'Created Date',
        formatter: (seller: Seller) => seller.created_on
      },
      {
        name: 'revenue',
        label: 'Revenue',
        formatter: (seller: Seller) => seller.revenue
      },
      {
        name: 'Action',
        label: 'Action',
        width: 80,
        formatter: this.sellerActionFormatter.bind(this),
        sort: false
      }];
  }


  // formats name cell
  sellerNameFormatter(seller: Seller): any {
    return this.sanitizer.bypassSecurityTrustHtml(
      `
      <div class="table-user">
      <img src="${seller.image}" alt="table-user" class="me-2 rounded-circle">
       <a href="javascript:void(0);" class="text-body fw-semibold">${seller.name}</a>
       </div>
      `
    );
  }


  // action cell formatter
  sellerActionFormatter(seller: Seller): any {
    return this.sanitizer.bypassSecurityTrustHtml(
      `<a href="javascript:void(0);" class="action-icon"> <i class="mdi mdi-square-edit-outline"></i></a>
           <a href="javascript:void(0);" class="action-icon"> <i class="mdi mdi-delete"></i></a>`
    )
  }

  // compares two cell value
  compare(v1: any, v2: any): number {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }

  /**
   * Sort the table data
   * @param event column name,sort direction
   */
  sort(event: SortEvent): void {
    if (event.direction === '') {
      this.sellerList = SELLERSLIST;
    } else {
      this.sellerList = [...this.sellerList].sort((a, b) => {
        const res = this.compare(a[event.column], b[event.column]);
        return event.direction === 'asc' ? res : -res;
      });
    }
  }

  /**
 * Match table data with search input
 * @param row Table row
 * @param term Search the value
 */
  matches(row: Seller, term: string) {
    return row.name?.toLowerCase().includes(term)
      || row.store?.toLowerCase().includes(term)
      || String(row.products)?.toLowerCase().includes(term)
      || row.balance?.toLowerCase().includes(term)
      || row.created_on?.toLowerCase().includes(term);
  }

  /**
   * Search Method
  */
  searchData(searchTerm: string): void {
    if (searchTerm === '') {
      this._fetchData();
    }
    else {
      let updatedData = SELLERSLIST;
      //  filter
      updatedData = updatedData.filter(seller => this.matches(seller, searchTerm));
      this.sellerList = updatedData;
    }

  }


}
