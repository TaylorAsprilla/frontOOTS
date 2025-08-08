import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { AnimationRoutingModule } from './animation-routing.module';
import { AnimationComponent } from './animation.component';


@NgModule({
  declarations: [
    AnimationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PageTitleModule,
    AnimationRoutingModule
  ]
})
export class AnimationModule { }
