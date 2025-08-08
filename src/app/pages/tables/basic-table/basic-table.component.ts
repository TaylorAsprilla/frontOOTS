import { Component, OnInit } from '@angular/core';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { PersonDetails } from './basic.model';
import { PERSONLIST } from './data';

@Component({
  selector: 'app-basic-table',
  templateUrl: './basic-table.component.html',
  styleUrls: ['./basic-table.component.scss']
})
export class BasicTableComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  personData: PersonDetails[] = [];

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Tables', path: '/' }, { label: 'Basic Tables', path: '/', active: true }];
    this._fetchData();

  }

  /**
  * fetches data
  */
  _fetchData(): void {
    this.personData = PERSONLIST;
  }

}
