import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleComponent } from 'src/app/shared/page-title/page-title.component';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';

@Component({
  selector: 'app-ui-placeholders',
  standalone: true,
  imports: [CommonModule, PageTitleComponent],
  templateUrl: './placeholders.component.html',
  styleUrls: ['./placeholders.component.scss'],
})
export class PlaceholdersComponent implements OnInit {
  pageTitle: BreadcrumbItem[] = [];

  constructor() {}

  ngOnInit(): void {
    this.pageTitle = [
      { label: 'Base UI', path: '/' },
      { label: 'Placeholders', path: '/', active: true },
    ];
  }
}
