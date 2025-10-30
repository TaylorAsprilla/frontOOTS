import { Component, OnInit } from '@angular/core';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { DUMMY_PROJECTS } from '../shared/data';
import { Project } from '../shared/projects.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule, NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { PageTitleComponent } from 'src/app/shared/page-title/page-title.component';

@Component({
  selector: 'app-project-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  imports: [CommonModule, RouterModule, NgbDropdownModule, NgbProgressbarModule, NgbTooltipModule, PageTitleComponent],
  standalone: true,
})
export class ListComponent implements OnInit {
  pageTitle: BreadcrumbItem[] = [];

  projectList: Project[] = [];

  constructor() {}

  ngOnInit(): void {
    this.pageTitle = [
      { label: 'Projects', path: '/' },
      { label: 'Projects List', path: '/', active: true },
    ];
    // get project list
    this._fetchData();
  }

  /**
   * fetches project list
   */
  _fetchData(): void {
    this.projectList = DUMMY_PROJECTS;
  }
}
