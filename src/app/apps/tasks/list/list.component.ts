import { Component, OnInit } from '@angular/core';
// import { SortableOptions } from 'sortablejs';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { OTHERTASKS, TODAYTASKS, UPCOMINGTASKS } from '../shared/data';
import { ListTaskItem } from '../shared/tasks.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule, NgbCollapseModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
// import { SortablejsModule } from 'ngx-sortablejs';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { PageTitleComponent } from 'src/app/shared/page-title/page-title.component';

@Component({
  selector: 'app-task-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    NgbDropdownModule,
    NgbCollapseModule,
    NgbTooltipModule,
    TaskDetailComponent,
    PageTitleComponent,
  ],
  standalone: true,
})
export class ListComponent implements OnInit {
  pageTitle: BreadcrumbItem[] = [];
  todaysTasks: ListTaskItem[] = [];
  upcomingTasks: ListTaskItem[] = [];
  otherTasks: ListTaskItem[] = [];
  showTodaysTask: boolean = false;
  showUpcomingTask: boolean = false;
  showOtherTask: boolean = false;
  selectedTask!: ListTaskItem;
  // options: SortableOptions = {};

  constructor() {}

  ngOnInit(): void {
    this.pageTitle = [
      { label: 'Tasks', path: '/' },
      { label: 'Tasks List', path: '/', active: true },
    ];
    // get task lists
    this._fetchData();
    // initialize selected task
    this.selectedTask = this.todaysTasks[0];

    // this.options = {
    //   group: 'tasks',
    // };
  }

  /**
   * fetches task data
   */
  _fetchData(): void {
    this.todaysTasks = TODAYTASKS;
    this.upcomingTasks = UPCOMINGTASKS;
    this.otherTasks = OTHERTASKS;
  }
}
