import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LightboxModule } from 'ngx-lightbox';


import { GalleryRoutingModule } from './gallery-routing.module';
import { GalleryComponent } from './gallery.component';


@NgModule({
    imports: [
    CommonModule,
    LightboxModule,
    GalleryRoutingModule,
    GalleryComponent
]
})
export class GalleryModule { }
