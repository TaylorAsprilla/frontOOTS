import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BreadcrumbItem } from './page-title.model';

@Component({
  selector: 'app-page-title',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss'],
})
export class PageTitleComponent implements OnInit {
  @Input() breadcrumbItems: BreadcrumbItem[] = [];
  @Input() title: string = '';
  constructor() {}

  ngOnInit(): void {}
}
