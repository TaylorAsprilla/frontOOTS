import { Component, OnInit } from '@angular/core';
import { TRENDINGTOPICS } from '../shared/data';
import { Topic } from '../shared/social-feed.model';

@Component({
  selector: 'app-social-trending',
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.scss']
})
export class TrendingComponent implements OnInit {

  trendingTopics: Topic[] = [];

  constructor () { }

  ngOnInit(): void {
    // get data
    this._fetchData();
  }

  /**
   * fetches trending news data
   */
  _fetchData(): void {
    this.trendingTopics = TRENDINGTOPICS;
  }

}
