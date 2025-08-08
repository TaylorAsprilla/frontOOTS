import { Component, OnInit } from '@angular/core';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { Variant } from '../shared/ui.model';

@Component({
  selector: 'app-ui-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  badgeVariants: Variant[] = [];
  page1 = 1;
  page2 = 1;
  page3 = 1;
  page4 = 1;
  page5 = 1;
  page6 = 1;



  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Base UI', path: '/' }, { label: 'General UI', path: '/', active: true }];
    this.badgeVariants = [
      {
        name: 'Primary',
        color: 'primary',
      },
      {
        name: 'Secondary',
        color: 'secondary',
      },
      {
        name: 'Success',
        color: 'success',
      },
      {
        name: 'Danger',
        color: 'danger',
      },
      {
        name: 'Warning',
        color: 'warning',
      },
      {
        name: 'Info',
        color: 'info',
      },
      {
        name: 'Pink',
        color: 'pink',
      },
      {
        name: 'Blue',
        color: 'blue',
      },
      {
        name: 'Light',
        color: 'light',
      },
      {
        name: 'Dark',
        color: 'dark',
      },
    ];
  }
}
