import { Component, OnInit } from '@angular/core';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { EMAILS } from '../shared/data';
import { Email } from '../shared/email.model';

@Component({
  selector: 'app-email-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  emailList: Email[] = [];
  emailCountPerPage: number = 20;
  totalEmails: number = EMAILS.length;
  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Email', path: '/' }, { label: 'Inbox', path: '/', active: true }];
    // get email list
    this._fetchData();
  }

  /**
   * fetches first page
   */
  _fetchData(): void {
    for (let i = 0; i < this.emailCountPerPage; i++) {
      this.emailList.push(EMAILS[i]);
    }
  }

  /**
   * fetches next page
   */
  getNextPage(): void {
    let emails: Email[] = [];
    for (let i = this.emailCountPerPage; i < this.emailCountPerPage + 20; i++) {
      emails.push(EMAILS[i]);
    }
    this.emailList = emails;
    this.emailCountPerPage += 20;
  }

  /**
   * fetches previous page
   */
  getPrevPage(): void {
    let emails: Email[] = [];
    this.emailCountPerPage -= 20;
    for (let i = this.emailCountPerPage; i < this.emailCountPerPage + 20; i++) {
      emails.push(EMAILS[i]);
    }
    this.emailList = emails;
  }

}
