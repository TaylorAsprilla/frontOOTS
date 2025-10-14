import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleComponent } from 'src/app/shared/page-title/page-title.component';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { Icon } from '../shared/icons.model';
import { WEATHERICONS } from './data';

@Component({
  selector: 'app-icon-weather',
  standalone: true,
  imports: [CommonModule, PageTitleComponent, NgbAlertModule],
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
})
export class WeatherComponent implements OnInit {
  pageTitle: BreadcrumbItem[] = [];
  weatherIcons: Icon[] = [];

  constructor() {}

  ngOnInit(): void {
    this.pageTitle = [
      { label: 'Icons', path: '/' },
      { label: 'Weather Icons', path: '/', active: true },
    ];
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
