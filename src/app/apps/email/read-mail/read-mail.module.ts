import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReadMailRoutingModule } from './read-mail-routing.module';
import { ReadMailComponent } from './read-mail.component';
import { SharedModule } from '../shared/shared.module';
import { QuillModule } from 'ngx-quill';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ReadMailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    QuillModule,
    PageTitleModule,
    SharedModule,
    ReadMailRoutingModule
  ]
})
export class ReadMailModule { }
