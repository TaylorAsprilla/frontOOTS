import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/core/models/auth.models';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { CommonModule } from '@angular/common';
import { PageTitleComponent } from 'src/app/shared/page-title/page-title.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { FeaturedVideoComponent } from './featured-video/featured-video.component';
import { NewPostComponent } from './new-post/new-post.component';
import { FeedComponent } from './feed/feed.component';
import { TrendingComponent } from './trending/trending.component';
import { FollowPeopleComponent } from './follow-people/follow-people.component';

@Component({
  selector: 'app-social-feed',
  templateUrl: './social-feed.component.html',
  styleUrls: ['./social-feed.component.scss'],
  imports: [
    CommonModule,
    PageTitleComponent,
    UserProfileComponent,
    FeaturedVideoComponent,
    NewPostComponent,
    FeedComponent,
    TrendingComponent,
    FollowPeopleComponent,
  ],
  standalone: true,
})
export class SocialFeedComponent implements OnInit {
  loggedInUser: any = {};
  pageTitle: BreadcrumbItem[] = [];

  constructor(private authService: AuthenticationService) {}

  ngOnInit(): void {
    this.loggedInUser = this.authService.currentUser();
    this.pageTitle = [
      { label: 'Apps', path: '/' },
      { label: 'Social Feed', path: '/', active: true },
    ];
  }
}
