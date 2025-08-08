import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { EditorsRoutingModule } from './editors-routing.module';
import { EditorsComponent } from './editors.component';


@NgModule({
  declarations: [
    EditorsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    QuillModule,
    PageTitleModule,
    EditorsRoutingModule
  ]
})
export class EditorsModule { }
