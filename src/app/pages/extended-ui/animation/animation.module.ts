import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AnimationRoutingModule } from './animation-routing.module';
import { AnimationComponent } from './animation.component';


@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    AnimationRoutingModule,
    AnimationComponent
]
})
export class AnimationModule { }
