import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { TIMELINEDATA } from './data';
import { TimelineItem } from './timeline.model';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  timelineData: TimelineItem[] = [];

  constructor (private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Extra Pages', path: '/' }, { label: 'Timeline', path: '/', active: true }];
    this._fetchData();
  }

  /**
   * fetches timeline data
   */
  _fetchData(): void {
    this.timelineData = TIMELINEDATA;
  }


  /**
 * returns the safe content which can be rendered
 * @param content content
 */
  getRenderedPostContent(content: string) {
    return this.sanitizer.sanitize(1, content);
  }




}
