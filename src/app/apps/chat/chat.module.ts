import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SimplebarAngularModule } from 'simplebar-angular';
import { NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { WidgetModule } from 'src/app/shared/widget/widget.module';
import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';
import { ChatUsersComponent } from './chat-users/chat-users.component';
import { ChatAreaComponent } from './chat-area/chat-area.component';


@NgModule({
  declarations: [
    ChatComponent,
    ChatUsersComponent,
    ChatAreaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SimplebarAngularModule,
    NgbTooltipModule,
    NgbDropdownModule,
    PageTitleModule,
    WidgetModule,
    ChatRoutingModule
  ]
})
export class ChatModule { }
