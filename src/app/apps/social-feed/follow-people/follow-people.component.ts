import { Component, OnInit } from '@angular/core';
import { PEOPLETOFOLLOW } from '../shared/data';
import { User } from '../shared/social-feed.model';

@Component({
  selector: 'app-social-follow-people',
  templateUrl: './follow-people.component.html',
  styleUrls: ['./follow-people.component.scss']
})
export class FollowPeopleComponent implements OnInit {

  peopleToFollow: User[] = [];
  constructor () { }

  ngOnInit(): void {
    // get person list to follow
    this._fetchData();
  }

  /**
   * fetches person list to follow
   */
  _fetchData(): void {
    this.peopleToFollow = PEOPLETOFOLLOW;
  }

}
