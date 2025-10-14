import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleComponent } from 'src/app/shared/page-title/page-title.component';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';

@Component({
  selector: 'app-ui-images',
  standalone: true,
  imports: [CommonModule, PageTitleComponent],
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss'],
})
export class ImagesComponent implements OnInit {
  pageTitle: BreadcrumbItem[] = [];

  constructor() {}

  ngOnInit(): void {
    this.pageTitle = [
      { label: 'Base UI', path: '/' },
      { label: 'Images', path: '/', active: true },
    ];
  }
}
