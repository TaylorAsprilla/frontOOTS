import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleComponent } from 'src/app/shared/page-title/page-title.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { Variant } from '../shared/ui.model';

@Component({
  selector: 'app-ui-dropdowns',
  standalone: true,
  imports: [CommonModule, PageTitleComponent, NgbDropdownModule],
  templateUrl: './dropdowns.component.html',
  styleUrls: ['./dropdowns.component.scss'],
})
export class DropdownsComponent implements OnInit {
  pageTitle: BreadcrumbItem[] = [];
  dropdownVariants: Variant[] = [];

  constructor() {}

  ngOnInit(): void {
    this.pageTitle = [
      { label: 'Base UI', path: '/' },
      { label: 'Dropdowns', path: '/', active: true },
    ];
    this.dropdownVariants = [
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
        name: 'Info',
        color: 'info',
      },
      {
        name: 'Warning',
        color: 'warning',
      },
      {
        name: 'Danger',
        color: 'danger',
      },
    ];
  }
}
