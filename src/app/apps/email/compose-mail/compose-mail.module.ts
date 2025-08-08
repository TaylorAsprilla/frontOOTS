import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComposeMailRoutingModule } from './compose-mail-routing.module';
import { ComposeMailComponent } from './compose-mail.component';
import { SharedModule } from '../shared/shared.module';
import { QuillModule } from 'ngx-quill';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ComposeMailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    QuillModule,
    PageTitleModule,
    SharedModule,
    ComposeMailRoutingModule
  ]
})
export class ComposeMailModule { }
