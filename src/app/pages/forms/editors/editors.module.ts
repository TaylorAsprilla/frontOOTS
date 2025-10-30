import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

import { EditorsRoutingModule } from './editors-routing.module';
import { EditorsComponent } from './editors.component';


@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    QuillModule,
    EditorsRoutingModule,
    EditorsComponent
]
})
export class EditorsModule { }
