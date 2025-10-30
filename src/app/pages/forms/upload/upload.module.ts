import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';

import { UploadRoutingModule } from './upload-routing.module';
import { UploadComponent } from './upload.component';


@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    NgxDropzoneModule,
    UploadRoutingModule,
    UploadComponent
]
})
export class UploadModule { }
