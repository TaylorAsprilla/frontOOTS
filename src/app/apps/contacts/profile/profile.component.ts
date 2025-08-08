import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { INBOXMESSAGES } from 'src/app/shared/widget/inbox/data';
import { Message } from 'src/app/shared/widget/inbox/inbox.model';
import { MemberInfo } from '../shared/contacts.model';
import { MEMBERLIST } from '../shared/data';

@Component({
  selector: 'app-contact-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  selectedMember!: MemberInfo;
  inboxMessages: Message[] = [];
  activeID = 2;

  constructor (private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.pageTitle = [{ label: 'Contacts', path: '/' }, { label: 'Profile', path: '/', active: true }];

    this.route.queryParams.subscribe(params => {
      if (params && params.hasOwnProperty('id')) {
        this.selectedMember = MEMBERLIST.filter(x => String(x.id) === params['id'])[0];
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
