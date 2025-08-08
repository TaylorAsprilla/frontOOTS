import { Component, OnInit } from '@angular/core';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { quickAccess, recentFiles } from './shared/data';
import { QuickAccessItem, RecentFileItem } from './shared/file.model';

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.scss']
})
export class FileManagerComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  quickAccessData: QuickAccessItem[] = [];
  recentFiles: RecentFileItem[] = [];

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Apps', path: '/' }, { label: 'File Manager', path: '/', active: true }];

    // get static data
    this._fetchData();

  }

  // fetches static data
  _fetchData(): void {
    this.quickAccessData = [...quickAccess];
    this.recentFiles = [...recentFiles];
  }

}
