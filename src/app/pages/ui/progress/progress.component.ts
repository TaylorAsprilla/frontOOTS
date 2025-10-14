import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { PageTitleComponent } from 'src/app/shared/page-title/page-title.component';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';

@Component({
  selector: 'app-ui-progress',
  standalone: true,
  imports: [CommonModule, PageTitleComponent, NgbProgressbarModule],
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss'],
})
export class ProgressComponent implements OnInit {
  pageTitle: BreadcrumbItem[] = [];

  constructor() {}

  ngOnInit(): void {
    this.pageTitle = [
      { label: 'Base UI', path: '/' },
      { label: 'Progress', path: '/', active: true },
    ];
  }
}
