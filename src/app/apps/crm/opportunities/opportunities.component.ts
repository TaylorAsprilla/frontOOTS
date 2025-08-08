import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChartOptions } from 'src/app/pages/charts/apex/apex-chart.model';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { CompanyInfoItem } from '../shared/crm.model';
import { COMPANYLIST } from '../shared/data';

@Component({
  selector: 'app-crm-opportunities',
  templateUrl: './opportunities.component.html',
  styleUrls: ['./opportunities.component.scss']
})
export class OpportunitiesComponent implements OnInit {


  pageTitle: BreadcrumbItem[] = [];
  newOpportunity!: FormGroup;
  companyList: CompanyInfoItem[] = [];
  searchTerm: string = '';
  sortCategory: string = 'All';
  staticsChart!: Partial<ChartOptions>;

  @ViewChild('content', { static: true }) content: any;

  constructor (
    public activeModal: NgbModal,
    private fb: FormBuilder
  ) { }


  ngOnInit(): void {
    this.pageTitle = [{ label: 'CRM', path: '/' }, { label: 'Opportunities', path: '/', active: true }];
    this.newOpportunity = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      category: ['', Validators.required]
    });
    this._fetchData();
    this.initChart();
  }

  // convenience getter for easy access to form fields
  get form1() { return this.newOpportunity.controls; }


  /**
   * fetches data
   */
  _fetchData(): void {
    this.companyList = COMPANYLIST;
  }

  /**
   * initialize chart
   */
  initChart(): void {
    this.staticsChart = {
      series: [28, 20, 40, 30, 10],
      chart: {
        type: 'pie',
        height: 300,
      },
      dataLabels: {
        enabled: false,
      },
      labels: ['Won', 'Hot', 'Cold', 'In-progress', 'Lost'],
      legend: {
        position: 'bottom',
        fontSize: '15px',
        horizontalAlign: 'center'
      },

    }
  }

  /**
 * opens modal
 * @param title title of modal 
 * @param data data to be used in modal
 */
  openModal(): void {
    this.activeModal.open(this.content, { centered: true });
  }


  /**
   * Search Method
  */
  searchData(searchTerm: string): void {
    if (searchTerm === '') {
      this._fetchData();
    }
    else {
      let updatedData = COMPANYLIST;
      //  filter
      updatedData = updatedData.filter(company => (company.name?.toLowerCase().includes(searchTerm) || company.location.toLowerCase().includes(searchTerm)));
      this.companyList = updatedData;
    }
  }

  changeCategory(status: string): void {
    this.sortCategory = status;
    this.companyList = this.sortCategory === 'All' ? COMPANYLIST : COMPANYLIST.filter((company) => company.status.includes(this.sortCategory));
  }

}
