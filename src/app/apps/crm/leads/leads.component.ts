import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChartOptions } from 'src/app/pages/charts/apex/apex-chart.model';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { CompanyInfoItem } from '../shared/crm.model';
import { COMPANYLIST } from '../shared/data';

@Component({
  selector: 'app-crm-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.scss']
})
export class LeadsComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  newOpportunity!: FormGroup;
  companyList: CompanyInfoItem[] = [];
  searchTerm: string = '';
  staticsChart!: Partial<ChartOptions>;

  @ViewChild('content', { static: true }) content: any;

  constructor (
    public activeModal: NgbModal,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'CRM', path: '/' }, { label: 'Leads', path: '/', active: true }];
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
      series: [
        {
          name: 'Won Leads',
          data: [75, 50, 75, 50, 75, 100, 80],
        },
        {
          name: 'Lost Leads',
          data: [65, 40, 65, 40, 65, 90, 65],
        },
      ],
      chart: {
        type: 'bar',
        stacked: true,
        height: 310,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          columnWidth: '20%',
        },
      },
      fill: {
        opacity: 1
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: ['2012', '2013', '2014', '2015', '2016', '2017', '2018'],
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      colors: ['#4a81d4', '#e3eaef'],
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
      updatedData = updatedData.filter(company => company.name?.toLowerCase().includes(searchTerm));
      this.companyList = updatedData;
    }

  }

}
