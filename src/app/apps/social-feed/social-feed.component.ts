import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/core/models/auth.models';
import { AuthenticationService } from 'src/app/core/service/auth.service';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';

@Component({
  selector: 'app-social-feed',
  templateUrl: './social-feed.component.html',
  styleUrls: ['./social-feed.component.scss']
})
export class SocialFeedComponent implements OnInit {

  loggedInUser: any = {};
  pageTitle: BreadcrumbItem[] = [];

  constructor (private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.loggedInUser = this.authService.currentUser();
    this.pageTitle = [{ label: 'Apps', path: '/' }, { label: 'Social Feed', path: '/', active: true }];
  }



}
