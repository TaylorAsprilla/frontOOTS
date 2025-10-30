import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { PageTitleComponent } from 'src/app/shared/page-title/page-title.component';
import { InboxComponent } from 'src/app/shared/widget/inbox/inbox.component';
import { INBOXMESSAGES } from 'src/app/shared/widget/inbox/data';
import { Message } from 'src/app/shared/widget/inbox/inbox.model';
import { MemberInfo } from '../shared/contacts.model';
import { MEMBERLIST } from '../shared/data';
import { AboutComponent } from './about/about.component';
import { TimelineComponent } from './timeline/timeline.component';
import { SettingsComponent } from './settings/settings.component';
import { UserboxComponent } from './userbox/userbox.component';

@Component({
  selector: 'app-contact-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgbNavModule,
    PageTitleComponent,
    InboxComponent,
    AboutComponent,
    TimelineComponent,
    SettingsComponent,
    UserboxComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  pageTitle: BreadcrumbItem[] = [];
  selectedMember!: MemberInfo;
  inboxMessages: Message[] = [];
  activeID = 2;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.pageTitle = [
      { label: 'Contacts', path: '/' },
      { label: 'Profile', path: '/', active: true },
    ];

    this.route.queryParams.subscribe((params) => {
      if (params && params.hasOwnProperty('id')) {
        this.selectedMember = MEMBERLIST.filter((x) => String(x.id) === params['id'])[0];
      } else {
        this.selectedMember = MEMBERLIST[0];
      }
    });

    this._fetchMessage();
  }

  /**
   * fetch inbox messages
   */
  _fetchMessage(): void {
    this.inboxMessages = INBOXMESSAGES;
  }
}
