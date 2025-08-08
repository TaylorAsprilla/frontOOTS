import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SimplebarAngularModule } from 'simplebar-angular';
import { NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';


import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';
import { ChatUsersComponent } from './chat-users/chat-users.component';
import { ChatAreaComponent } from './chat-area/chat-area.component';


@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    SimplebarAngularModule,
    NgbTooltipModule,
    NgbDropdownModule,
    ChatRoutingModule,
    ChatComponent,
    ChatUsersComponent,
    ChatAreaComponent
]
})
export class ChatModule { }
