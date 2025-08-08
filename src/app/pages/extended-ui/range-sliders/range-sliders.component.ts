import { Component, OnInit } from '@angular/core';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { SLIDERVARIANTS } from './data';
import { SliderItem } from './rangeslider.model';

@Component({
  selector: 'app-extended-ui-range-sliders',
  templateUrl: './range-sliders.component.html',
  styleUrls: ['./range-sliders.component.scss']
})
export class RangeSlidersComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  rangeSliders: SliderItem[] = [];

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Extended UI', path: '/' }, { label: 'Range Slider', path: '/', active: true }];
    this.rangeSliders = SLIDERVARIANTS;
  }
}
