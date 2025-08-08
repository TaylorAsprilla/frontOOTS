import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Column } from 'src/app/shared/advanced-table/advanced-table.component';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { CRMCustomer } from '../shared/crm.model';
import { CRMCUSTOMERS } from '../shared/data';

@Component({
  selector: 'app-crm-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  customers: CRMCustomer[] = [];
  columns: Column[] = [];
  newCustomer!: FormGroup;

  @ViewChild('advancedTable') advancedTable: any;
  @ViewChild('content', { static: true }) content: any;


  constructor (
    private sanitizer: DomSanitizer,
    public activeModal: NgbModal,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'CRM', path: '/' }, { label: 'Customers', path: '/', active: true }];
    this._fetchData();
    // initialize advance table 
    this.initAdvancedTableData();

    this.newCustomer = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      location: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get form1() { return this.newCustomer.controls; }


  /**
   * opens modal
   * @param title title of modal 
   * @param data data to be used in modal
   */
  openModal(): void {
    this.activeModal.open(this.content, { centered: true });
  }

  /**
   * fetch contact list
   */
  _fetchData(): void {
    this.customers = CRMCUSTOMERS;
  }

  /**
* initialize advance table columns
*/
  initAdvancedTableData(): void {
    this.columns = [
      {
        name: 'name',
        label: 'Customer',
        formatter: this.customerNameFormatter.bind(this)
      },
      {
        name: 'phone',
        label: 'Phone',
        formatter: (customer: CRMCustomer) => customer.phone
      },
      {
        name: 'email',
        label: 'Email',
        formatter: (customer: CRMCustomer) => customer.email
      },
      {
        name: 'location',
        label: 'Location',
        formatter: (customer: CRMCustomer) => customer.location
      },
      {
        name: 'created_date',
        label: 'Created On',
        formatter: (customer: CRMCustomer) => customer.created_date
      },
      {
        name: 'status',
        label: 'Status',
        formatter: this.customerStatusFormatter.bind(this)
      },
      {
        name: 'Action',
        label: 'Action',
        width: 82,
        formatter: this.customerActionFormatter.bind(this),
        sort: false
      }]
  }


  // formats name cell
  customerNameFormatter(customer: CRMCustomer): any {
    return this.sanitizer.bypassSecurityTrustHtml(
      `
      <div class="table-user">
      <img src="${customer.avatar}" alt="table-user" class="me-2 rounded-circle">
       <a href="javascript:void(0);" class="customer text-body fw-semibold" id="${customer.id}">${customer.name}</a>
       </div>
      `
    );
  }

  // formats customer status
  customerStatusFormatter(customer: CRMCustomer): any {
    if (customer.status == "Active") {
      return this.sanitizer.bypassSecurityTrustHtml(
        `<span class="badge bg-soft-success text-success">Active</span>`
      );
    }
    else {
      return this.sanitizer.bypassSecurityTrustHtml(
        `<span class="badge bg-soft-danger text-danger">Blocked</span>`
      );
    }

  }


  // action cell formatter
  customerActionFormatter(): any {
    return this.sanitizer.bypassSecurityTrustHtml(
      ` <a href="javascript:void(0);" class="action-icon"> <i class="mdi mdi-square-edit-outline"></i></a>
        <a href="javascript:void(0);" class="action-icon"> <i class="mdi mdi-delete"></i></a>`
    );
  }

  /**
* Match table data with search input
* @param row Table row
* @param term Search the value
*/
  matches(row: CRMCustomer, term: string) {
    return row.name?.toLowerCase().includes(term)
      || row.phone?.toLowerCase().includes(term)
      || row.created_date.toLowerCase().includes(term)
      || row.company.toLowerCase().includes(term)
      || row.email?.toLocaleLowerCase().includes(term);
  }

  /**
   * Search Method
  */
  searchData(searchTerm: string): void {
    if (searchTerm === '') {
      this._fetchData();
    }
    else {
      let updatedData = CRMCUSTOMERS;
      //  filter
      updatedData = updatedData.filter(customer => this.matches(customer, searchTerm));
      this.customers = updatedData;
    }

  }

}
