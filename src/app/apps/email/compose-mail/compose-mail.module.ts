import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComposeMailRoutingModule } from './compose-mail-routing.module';
import { ComposeMailComponent } from './compose-mail.component';

import { QuillModule } from 'ngx-quill';

import { FormsModule } from '@angular/forms';


@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    QuillModule,
    ComposeMailRoutingModule,
    ComposeMailComponent
]
})
export class ComposeMailModule { }
