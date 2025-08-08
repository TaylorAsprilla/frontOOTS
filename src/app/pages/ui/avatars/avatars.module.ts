import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { AvatarsRoutingModule } from './avatars-routing.module';
import { AvatarsComponent } from './avatars.component';


@NgModule({
  declarations: [
    AvatarsComponent
  ],
  imports: [
    CommonModule,
    PageTitleModule,
    AvatarsRoutingModule
  ]
})
export class AvatarsModule { }
