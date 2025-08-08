import { Component, Input, OnInit } from '@angular/core';
import { ListTaskItem } from '../../shared/tasks.model';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit {

  @Input() selectedTask!: ListTaskItem;
  newComment: string = '';


  constructor () { }

  ngOnInit(): void {
  }

}
