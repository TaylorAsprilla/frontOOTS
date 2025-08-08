import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { ALLRESULTS, USERS } from './data';
import { AllResult, UserResult } from './search-result.model';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  searchResults: AllResult[] = [];
  users: UserResult[] = [];
  userPage: number = 2;
  allResultPage: number = 2;

  constructor (private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Extra Pages', path: '/' }, { label: 'Search Results', path: '/', active: true }];
    this._fetchSearchResults();
  }

  /**
   * fetches search result 
   */
  _fetchSearchResults(): void {
    this.searchResults = ALLRESULTS;
    this.users = USERS;
  }

  /**
   * checks whether output contains user or not
   * @param data search result
   * @returns 
   */
  searchIsUser(data: AllResult): boolean {
    return typeof (data.content) === typeof (this.users);
  }

  /**
 * returns the safe content which can be rendered
 * @param content content
 */
  getRenderedPostContent(content: any) {
    if (content.includes("iframe")) {
      return this.sanitizer.bypassSecurityTrustHtml(content);
    }
    return this.sanitizer.sanitize(1, content);
  }

}
