import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReadMailRoutingModule } from './read-mail-routing.module';
import { ReadMailComponent } from './read-mail.component';

import { QuillModule } from 'ngx-quill';

import { FormsModule } from '@angular/forms';


@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    QuillModule,
    ReadMailRoutingModule,
    ReadMailComponent
]
})
export class ReadMailModule { }
