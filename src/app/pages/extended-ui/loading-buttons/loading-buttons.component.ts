import { Component, OnInit } from '@angular/core';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';

@Component({
  selector: 'app-exended-ui-loading-buttons',
  templateUrl: './loading-buttons.component.html',
  styleUrls: ['./loading-buttons.component.scss']
})
export class LoadingButtonsComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Extended UI', path: '/' }, { label: 'Loading Buttons', path: '/', active: true }];
  }

}
