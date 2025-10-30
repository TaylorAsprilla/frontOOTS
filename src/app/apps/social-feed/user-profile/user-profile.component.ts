import { Component, Input, OnInit } from '@angular/core';
import { PagesLike } from '../shared/social-feed.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-social-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  imports: [CommonModule, RouterModule, NgbDropdownModule],
  standalone: true,
})
export class UserProfileComponent implements OnInit {
  @Input() loggedInUser: any = {};
  pagesLiked: PagesLike[] = [];

  constructor() {}

  ngOnInit(): void {
    this.pagesLiked = [
      {
        pageName: 'Football Team',
        icon: 'F',
        variant: 'success',
        count: {
          text: '142',
          variant: 'pink',
        },
      },
      {
        pageName: 'UI/UX Community',
        icon: 'U',
        variant: 'warning',
      },
      {
        pageName: 'Web Designer',
        icon: 'W',
        variant: 'info',
      },
    ];
  }
}
