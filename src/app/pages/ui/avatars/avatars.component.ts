import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleComponent } from 'src/app/shared/page-title/page-title.component';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';

@Component({
  selector: 'app-ui-avatars',
  standalone: true,
  imports: [CommonModule, PageTitleComponent],
  templateUrl: './avatars.component.html',
  styleUrls: ['./avatars.component.scss'],
})
export class AvatarsComponent implements OnInit {
  pageTitle: BreadcrumbItem[] = [];
  constructor() {}

  ngOnInit(): void {
    this.pageTitle = [
      { label: 'Base UI', path: '/' },
      { label: 'Avatars', path: '/', active: true },
    ];
  }
}
