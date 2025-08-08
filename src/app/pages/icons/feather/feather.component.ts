import { Component, OnInit } from '@angular/core';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { Icon } from '../shared/icons.model';
import { FEATHERICONLIST } from './data';

@Component({
  selector: 'app-icon-feather',
  templateUrl: './feather.component.html',
  styleUrls: ['./feather.component.scss']
})
export class FeatherComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  featherIcons: Icon[] = [];

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Icons', path: '/' }, { label: 'Feather Icons', path: '/', active: true }];
    this.featherIcons = FEATHERICONLIST;
  }

}
