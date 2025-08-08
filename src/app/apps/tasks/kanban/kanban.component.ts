import { Component, OnInit } from '@angular/core';
import { SortableOptions } from 'sortablejs';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { KANBANTASKS } from '../shared/data';
import { KanbanBoardTaskItem } from '../shared/tasks.model';

@Component({
  selector: 'app-task-kanban-board',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss']
})
export class KanbanComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  upcomingTasks!: KanbanBoardTaskItem[];
  inprogressTasks!: KanbanBoardTaskItem[];
  completedTasks!: KanbanBoardTaskItem[];
  options: SortableOptions = {};


  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Tasks', path: '/' }, { label: 'Kanban Board', path: '/', active: true }];

    this.options = {
      group: 'kanban-tasks'
    }
    // get task list
    this._fetchData();
  }


  /**
   * fetches task list
   */
  _fetchData(): void {
    this.upcomingTasks = KANBANTASKS.filter(t => t.status === 'Upcoming');
    this.inprogressTasks = KANBANTASKS.filter(t => t.status === 'Inprogress');
    this.completedTasks = KANBANTASKS.filter(t => t.status === 'Completed');
  }
}
