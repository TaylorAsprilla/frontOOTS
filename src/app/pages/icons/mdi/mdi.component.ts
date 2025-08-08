import { Component, OnInit } from '@angular/core';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { MdiIcon, MDIICONSLIST } from './data';

@Component({
  selector: 'app-icon-mdi',
  templateUrl: './mdi.component.html',
  styleUrls: ['./mdi.component.scss']
})
export class MdiComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  mdiIconsList: MdiIcon[] = [];
  mdiNewIcons: MdiIcon[] = [];

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Icons', path: '/' }, { label: 'Material Design Icons', path: '/', active: true }];
    this.mdiIconsList = MDIICONSLIST;
    this.mdiNewIcons = MDIICONSLIST.filter((icon: MdiIcon) => icon.version === '5.8.55');
  }
}
