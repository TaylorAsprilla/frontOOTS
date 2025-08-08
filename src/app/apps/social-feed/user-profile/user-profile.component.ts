import { Component, Input, OnInit } from '@angular/core';
import { PagesLike } from '../shared/social-feed.model';

@Component({
  selector: 'app-social-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  @Input() loggedInUser: any = {};
  pagesLiked: PagesLike[] = [];

  constructor () { }

  ngOnInit(): void {
    this.pagesLiked = [
      {
        pageName: 'Football Team',
        icon: 'F',
        variant: 'success',
        count: {
          text: '142',
          variant: 'pink'
        }
      },
      {
        pageName: 'UI/UX Community',
        icon: 'U',
        variant: 'warning'
      },
      {
        pageName: 'Web Designer',
        icon: 'W',
        variant: 'info'
      },
    ]
  }

}
