import { Component, OnInit } from '@angular/core';
import { SortableOptions } from 'sortablejs';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { PROJECTS, TEAM1, TEAM2, TEAM3, TEAM4 } from './data';
import { Person, Project } from './drag-drop.model';

@Component({
  selector: 'app-extended-ui-drag-drop',
  templateUrl: './drag-drop.component.html',
  styleUrls: ['./drag-drop.component.scss']
})
export class DragDropComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  movableProjectCards: Project[] = [];
  movableCardGroup1: Person[] = [];
  movableCardGroup2: Person[] = [];
  movableCardGroup3: Person[] = [];
  movableCardGroup4: Person[] = [];
  options1: SortableOptions = {};
  options2: SortableOptions = {};

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Extended UI', path: '/' }, { label: 'Drag and Drop', path: '/', active: true }];
    this._fetchData();
    this.options1 = {
      group: 'container1'
    }

    this.options2 = {
      group: 'container2',
      handle: '.dragula-handle',
    }
  }

  /**
   * fetches data
   */
  _fetchData(): void {
    this.movableProjectCards = PROJECTS;
    this.movableCardGroup1 = TEAM1;
    this.movableCardGroup2 = TEAM2;
    this.movableCardGroup3 = TEAM3;
    this.movableCardGroup4 = TEAM4;
  }

}
