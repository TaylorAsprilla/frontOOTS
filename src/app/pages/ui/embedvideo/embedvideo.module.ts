import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { EmbedvideoRoutingModule } from './embedvideo-routing.module';
import { EmbedvideoComponent } from './embedvideo.component';


@NgModule({
  declarations: [
    EmbedvideoComponent
  ],
  imports: [
    CommonModule,
    PageTitleModule,
    EmbedvideoRoutingModule
  ]
})
export class EmbedvideoModule { }
