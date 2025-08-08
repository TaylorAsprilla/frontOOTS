import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { ImagesRoutingModule } from './images-routing.module';
import { ImagesComponent } from './images.component';


@NgModule({
  declarations: [
    ImagesComponent
  ],
  imports: [
    CommonModule,
    PageTitleModule,
    ImagesRoutingModule
  ]
})
export class ImagesModule { }
