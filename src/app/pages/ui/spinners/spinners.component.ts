import { Component, OnInit } from '@angular/core';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';

@Component({
  selector: 'app-ui-spinners',
  templateUrl: './spinners.component.html',
  styleUrls: ['./spinners.component.scss']
})
export class SpinnersComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  spinnerVariants: string[] = [];

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Base UI', path: '/' }, { label: 'Spinners', path: '/', active: true }];
    this.spinnerVariants = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'blue', 'pink'];
  }

}
