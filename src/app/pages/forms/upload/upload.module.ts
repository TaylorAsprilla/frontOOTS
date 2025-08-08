import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { UploadRoutingModule } from './upload-routing.module';
import { UploadComponent } from './upload.component';


@NgModule({
  declarations: [
    UploadComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxDropzoneModule,
    PageTitleModule,
    UploadRoutingModule
  ]
})
export class UploadModule { }
