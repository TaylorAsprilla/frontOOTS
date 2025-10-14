import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleComponent } from 'src/app/shared/page-title/page-title.component';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';

@Component({
  selector: 'app-ui-spinners',
  standalone: true,
  imports: [CommonModule, PageTitleComponent],
  templateUrl: './spinners.component.html',
  styleUrls: ['./spinners.component.scss'],
})
export class SpinnersComponent implements OnInit {
  pageTitle: BreadcrumbItem[] = [];
  spinnerVariants: string[] = [];

  constructor() {}

  ngOnInit(): void {
    this.pageTitle = [
      { label: 'Base UI', path: '/' },
      { label: 'Spinners', path: '/', active: true },
    ];
    this.spinnerVariants = [
      'primary',
      'secondary',
      'success',
      'danger',
      'warning',
      'info',
      'light',
      'dark',
      'blue',
      'pink',
    ];
  }
}
