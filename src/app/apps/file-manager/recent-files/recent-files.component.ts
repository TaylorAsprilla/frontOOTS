import { Component, Input, OnInit } from '@angular/core';
import feather from "feather-icons";
import { RecentFileItem } from '../shared/file.model';

@Component({
  selector: 'app-recent-files',
  templateUrl: './recent-files.component.html',
  styleUrls: ['./recent-files.component.scss']
})
export class RecentFilesComponent implements OnInit {

  @Input() recentFiles: RecentFileItem[] = [];

  constructor () { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    feather.replace();
  }


}
