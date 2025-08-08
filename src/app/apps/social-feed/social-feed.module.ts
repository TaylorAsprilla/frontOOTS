import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { SocialFeedRoutingModule } from './social-feed-routing.module';
import { SocialFeedComponent } from './social-feed.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { NewPostComponent } from './new-post/new-post.component';
import { FeaturedVideoComponent } from './featured-video/featured-video.component';
import { TrendingComponent } from './trending/trending.component';
import { FollowPeopleComponent } from './follow-people/follow-people.component';
import { FeedComponent } from './feed/feed.component';


@NgModule({
  declarations: [
    SocialFeedComponent,
    UserProfileComponent,
    NewPostComponent,
    FeaturedVideoComponent,
    TrendingComponent,
    FollowPeopleComponent,
    FeedComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbDropdownModule,
    NgbNavModule,
    PageTitleModule,
    SocialFeedRoutingModule
  ]
})
export class SocialFeedModule { }
