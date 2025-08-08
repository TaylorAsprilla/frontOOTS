import { Component, OnInit } from '@angular/core';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { Icon } from '../shared/icons.model';
import { THEMIFYICONS_LIST } from './data';

@Component({
  selector: 'app-icon-themify',
  templateUrl: './themify.component.html',
  styleUrls: ['./themify.component.scss']
})
export class ThemifyComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  themifyIcons: Icon[] = [];

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Icons', path: '/' }, { label: 'Themify Icons', path: '/', active: true }];
    this._fetchData();
  }

  /**
   * fetch data
   */
  _fetchData(): void {
    this.themifyIcons = THEMIFYICONS_LIST;
  }

  /**
 * filter icons by category
 * @param category category
 */
  filterIcons(category: string): Icon[] {
    return this.themifyIcons.filter((icon) => icon.category === category);
  }
}
