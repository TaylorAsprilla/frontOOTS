import { Component, OnInit } from '@angular/core';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { Company } from './companies.model';
import { COMPANIES } from './data';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})
export class CompaniesComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  companyList: Company[] = [];
  searchTerm: string = '';
  page = 1;

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Apps', path: '/' }, { label: 'Companies', path: '/', active: true }];
    this._fetchData();
  }

  /**
   * fetches company list
   */
  _fetchData(): void {
    this.companyList = COMPANIES;
  }


  /**
   * Search Method
   */
  searchData(searchTerm: string): void {

    if (searchTerm === '') {
      this._fetchData();
    }
    else {
      let updatedData = COMPANIES;
      //  filter
      updatedData = updatedData.filter(company => (company.name?.toLowerCase().includes(searchTerm) || company.location.toLowerCase().includes(searchTerm)));
      this.companyList = updatedData;
    }

  }

}
