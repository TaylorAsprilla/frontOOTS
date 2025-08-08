import { AfterViewInit, Component, OnInit } from '@angular/core';
import feather from "feather-icons";
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { Icon } from '../shared/icons.model';
import { TWOTONEICONLIST, TWOTONEICONWITHVARIANT } from './data';


@Component({
  selector: 'app-two-tone-icon',
  templateUrl: './two-tone-icon.component.html',
  styleUrls: ['./two-tone-icon.component.scss']
})
export class TwoToneIconComponent implements OnInit, AfterViewInit {

  pageTitle: BreadcrumbItem[] = [];

  twoToneIcons: Icon[] = [];
  IconWithVariant: Icon[] = [];

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Icons', path: '/' }, { label: 'Two Tone Icons', path: '/', active: true }];
    this._fetchData();
  }

  ngAfterViewInit(): void {
    feather.replace();
  }



  /**
   * fetch data
   */
  _fetchData(): void {
    this.twoToneIcons = TWOTONEICONLIST;
    this.IconWithVariant = TWOTONEICONWITHVARIANT;
  }

}
