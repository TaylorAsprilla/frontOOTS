import { Component, OnInit } from '@angular/core';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { DUMMY_PROJECTS } from '../shared/data';
import { Project } from '../shared/projects.model';

@Component({
  selector: 'app-project-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];

  projectList: Project[] = [];

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Projects', path: '/' }, { label: 'Projects List', path: '/', active: true }];
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
