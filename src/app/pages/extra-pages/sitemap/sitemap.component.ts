import { Component, OnInit } from '@angular/core';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { SITEMAPDATA } from './data';
import { SitemapItem } from './sitemap.model';

@Component({
  selector: 'app-sitemap',
  templateUrl: './sitemap.component.html',
  styleUrls: ['./sitemap.component.scss']
})
export class SitemapComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  sitemapData: SitemapItem[] = [];

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Extra Pages', path: '/' }, { label: 'Sitemap', path: '/', active: true }];
    this._fetchData();
  }

  /**
   * fetches sitemap data
   */
  _fetchData(): void {
    this.sitemapData = SITEMAPDATA;
  }

}
