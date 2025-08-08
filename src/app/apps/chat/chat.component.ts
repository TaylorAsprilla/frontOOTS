import { Component, OnInit } from '@angular/core';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { ChatUser } from './chat.model';
import { USERS } from './data';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];

  selectedUser!: ChatUser;

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Apps', path: '/', }, { label: 'Chat', path: '/', active: true }];

    // set initial user
    this.selectedUser = USERS[3];
  }

  /**
 * changes chat user
 * @param user selected user
 */
  onSelectedUser(user: ChatUser): void {
    this.selectedUser = user;
  }

}
