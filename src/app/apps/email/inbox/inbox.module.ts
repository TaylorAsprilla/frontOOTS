import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InboxRoutingModule } from './inbox-routing.module';
import { InboxComponent } from './inbox.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';


@NgModule({
  declarations: [
    InboxComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PageTitleModule,
    SharedModule,
    InboxRoutingModule
  ]
})
export class InboxModule { }
