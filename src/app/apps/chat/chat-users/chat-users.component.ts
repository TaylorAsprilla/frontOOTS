import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthenticationService } from 'src/app/core/service/auth.service';
import { ChatGroup } from 'src/app/shared/widget/chat-group/chat-group.model';
import { ChatUser } from '../chat.model';
import { USERS } from '../data';

@Component({
  selector: 'app-chat-users',
  templateUrl: './chat-users.component.html',
  styleUrls: ['./chat-users.component.scss']
})
export class ChatUsersComponent implements OnInit {

  loggedInUser: any = {};
  userList: ChatUser[] = [];
  @Input() selectedUser!: ChatUser;
  chatGroups: ChatGroup[] = [];

  //On selecting new user
  @Output() selectUser: EventEmitter<ChatUser> = new EventEmitter();

  constructor (private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.loggedInUser = this.authService.currentUser();
    this.chatGroups = [{
      id: 1,
      groupName: 'App Development',
      variant: 'success'
    },
    {
      id: 2,
      groupName: 'Office Work',
      variant: 'warning'
    }];

    // Get users for chat
    this._fetchUsers();
  }

  /**
   *  Fetches users for chat
   */
  _fetchUsers(): void {
    this.userList = USERS;
  }

  /**
   * changes active user
   * @param user chat user
   */
  activateUser(user: ChatUser): void {
    this.selectedUser = user;
    this.selectUser.emit(this.selectedUser);
  }

}
