import { Component, Input, OnInit } from '@angular/core';
import { ListTaskItem } from '../../shared/tasks.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
// import { QuillModule } from 'ngx-quill'; // Temporarily commented due to compatibility issues

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss'],
  imports: [CommonModule, FormsModule, RouterModule, NgbDropdownModule], // QuillModule removed temporarily
  standalone: true,
})
export class TaskDetailComponent implements OnInit {
  @Input() selectedTask!: ListTaskItem;
  newComment: string = '';

  constructor() {}

  ngOnInit(): void {}
}
