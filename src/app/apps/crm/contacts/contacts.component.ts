import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Column } from 'src/app/shared/advanced-table/advanced-table.component';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { CRMCustomer } from '../shared/crm.model';
import { CRMCUSTOMERS } from '../shared/data';

@Component({
  selector: 'app-crm-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  contacts: CRMCustomer[] = [];
  columns: Column[] = [];
  selectedContact!: CRMCustomer;
  newContact!: FormGroup;

  @ViewChild('advancedTable') advancedTable: any;
  @ViewChild('content', { static: true }) content: any;

  constructor (
    private sanitizer: DomSanitizer,
    public activeModal: NgbModal,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'CRM', path: '/' }, { label: 'Contacts', path: '/', active: true }];
    this._fetchData();
    // initialize advance table 
    this.initAdvancedTableData();

    this.selectedContact = this.contacts[0];

    this.newContact = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      location: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get form1() { return this.newContact.controls; }

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
    this.contacts = CRMCUSTOMERS;
  }

  /**
   * initialize advance table columns
   */
  initAdvancedTableData(): void {
    this.columns = [
      {
        name: 'name',
        label: 'Basic Info',
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
        name: 'company',
        label: 'Company Name',
        formatter: (customer: CRMCustomer) => customer.company
      },
      {
        name: 'created_date',
        label: 'Created Date',
        formatter: (customer: CRMCustomer) => customer.created_date
      },
      {
        name: 'Action',
        label: 'Action',
        width: 82,
        formatter: this.customerActionFormatter.bind(this),
        sort: false
      }]
  }

  /**
 *  handles operations that need to be performed after loading table
 */
  handleTableLoad(event: any): void {
    // product cell
    document.querySelectorAll('.customer').forEach((e) => {
      e.addEventListener("click", () => {
        this.selectedContact = this.contacts[Number(e.id) - 1]

      });
    })
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
      this.contacts = updatedData;
    }

  }

}
