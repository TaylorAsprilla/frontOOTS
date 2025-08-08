import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-portlet-with-header',
  templateUrl: './portlet-with-header.component.html',
  styleUrls: ['./portlet-with-header.component.scss']
})
export class PortletWithHeaderComponent implements OnInit {

  @Input() cardTitleClass?: string;
  @Input() cardHeaderClass: string = '';
  isCollapsed: boolean = false;
  isClosed: boolean = false;
  refreshRequsted: boolean = false;

  constructor () { }

  ngOnInit(): void {
  }

  /**
 * closes portlet card
 */
  closeCard(): void {
    this.isClosed = true;
  }

  /**
   * refresh card content
   */
  refreshContent(): void {
    this.refreshRequsted = true;
    setTimeout(() => {
      this.refreshRequsted = false;
    }, 1000);
  }

}
