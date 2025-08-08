import { Component, OnInit } from '@angular/core';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { FAICONS } from './data';

@Component({
  selector: 'app-icon-font-awesome',
  templateUrl: './font-awesome.component.html',
  styleUrls: ['./font-awesome.component.scss']
})
export class FontAwesomeComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  solidIconList: any[] = [];
  regularIconList: any[] = [];
  brandsIconList: any[] = [];

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Icons', path: '/' }, { label: 'Font Awesome Icons', path: '/', active: true }];
    this._fetchData();
  }

  /**
   * fetch data
   */
  _fetchData(): void {
    this.solidIconList = FAICONS.data.filter((icon: any) => icon.attributes.membership.free.includes('solid'));
    this.regularIconList = FAICONS.data.filter((icon: any) => icon.attributes.membership.free.includes('regular'));
    this.brandsIconList = FAICONS.data.filter((icon: any) => icon.attributes.membership.free.includes('brands'));
  }

}
