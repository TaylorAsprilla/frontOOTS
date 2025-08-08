import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmbedvideoRoutingModule } from './embedvideo-routing.module';
import { EmbedvideoComponent } from './embedvideo.component';


@NgModule({
    imports: [
    CommonModule,
    EmbedvideoRoutingModule,
    EmbedvideoComponent
]
})
export class EmbedvideoModule { }
