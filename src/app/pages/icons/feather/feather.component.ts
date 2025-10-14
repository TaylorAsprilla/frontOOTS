import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleComponent } from 'src/app/shared/page-title/page-title.component';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { Icon } from '../shared/icons.model';
import { FEATHERICONLIST } from './data';

@Component({
  selector: 'app-icon-feather',
  standalone: true,
  imports: [CommonModule, PageTitleComponent],
  templateUrl: './feather.component.html',
  styleUrls: ['./feather.component.scss'],
})
export class FeatherComponent implements OnInit {
  pageTitle: BreadcrumbItem[] = [];
  featherIcons: Icon[] = [];

  constructor() {}

  ngOnInit(): void {
    this.pageTitle = [
      { label: 'Icons', path: '/' },
      { label: 'Feather Icons', path: '/', active: true },
    ];
    this.featherIcons = FEATHERICONLIST;
  }
}
