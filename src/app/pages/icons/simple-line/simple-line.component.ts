import { Component, OnInit } from '@angular/core';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { Icon } from '../shared/icons.model';
import { SIMPLELINEICONS } from './data';

@Component({
  selector: 'app-icon-simple-line',
  templateUrl: './simple-line.component.html',
  styleUrls: ['./simple-line.component.scss']
})
export class SimpleLineComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  simpleLineIcons: Icon[] = [];

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Icons', path: '/' }, { label: 'Simple Line Icons', path: '/', active: true }];
    this.simpleLineIcons = SIMPLELINEICONS;
  }

}
