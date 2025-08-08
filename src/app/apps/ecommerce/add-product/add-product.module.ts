import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Select2Module } from 'ng-select2-component';
import { QuillModule } from 'ngx-quill';
import { NgxDropzoneModule } from 'ngx-dropzone';

import { AddProductRoutingModule } from './add-product-routing.module';
import { AddProductComponent } from './add-product.component';




@NgModule({
  declarations: [
    AddProductComponent
  ],
  imports: [
    CommonModule,
    QuillModule,
    NgxDropzoneModule,
    Select2Module,
    AddProductRoutingModule
]
})
export class AddProductModule { }
