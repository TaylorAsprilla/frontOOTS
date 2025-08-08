import { Component, OnInit } from '@angular/core';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { Icon } from '../shared/icons.model';
import { WEATHERICONS } from './data';

@Component({
  selector: 'app-icon-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  weatherIcons: Icon[] = [];

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Icons', path: '/' }, { label: 'Weather Icons', path: '/', active: true }];
    this._fetchData();
  }

  /**
   * fetch data
   */
  _fetchData(): void {
    this.weatherIcons = WEATHERICONS;
  }

  /**
   * filter icons by category
   * @param category category
   */
  filterIcons(category: string): Icon[] {
    return this.weatherIcons.filter((icon) => icon.category === category);
  }
}
