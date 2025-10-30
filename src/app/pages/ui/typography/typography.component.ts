import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleComponent } from 'src/app/shared/page-title/page-title.component';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';

@Component({
  selector: 'app-ui-typography',
  standalone: true,
  imports: [CommonModule, PageTitleComponent],
  templateUrl: './typography.component.html',
  styleUrls: ['./typography.component.scss'],
})
export class TypographyComponent implements OnInit {
  pageTitle: BreadcrumbItem[] = [];

  constructor() {}

  ngOnInit(): void {
    this.pageTitle = [
      { label: 'Base UI', path: '/' },
      { label: 'Typography', path: '/', active: true },
    ];
  }
}
