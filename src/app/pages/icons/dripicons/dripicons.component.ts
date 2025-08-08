import { Component, OnInit } from '@angular/core';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { Icon } from '../shared/icons.model';
import { DRIPICONSLIST } from './data';

@Component({
  selector: 'app-icon-dripicons',
  templateUrl: './dripicons.component.html',
  styleUrls: ['./dripicons.component.scss']
})
export class DripiconsComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  dripIconList: Icon[] = [];

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Icons', path: '/' }, { label: 'Dripicons Icons', path: '/', active: true }];
    this.dripIconList = DRIPICONSLIST;
  }


}
