import { Component, Input, OnInit } from '@angular/core';
import { QuickAccessItem } from '../shared/file.model';

@Component({
  selector: 'app-file-quick-access',
  templateUrl: './quick-access.component.html',
  styleUrls: ['./quick-access.component.scss']
})
export class QuickAccessComponent implements OnInit {

  @Input() quickAccessFiles: QuickAccessItem[] = [];

  constructor () { }

  ngOnInit(): void {
  }

}
