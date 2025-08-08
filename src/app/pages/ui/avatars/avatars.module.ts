import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AvatarsRoutingModule } from './avatars-routing.module';
import { AvatarsComponent } from './avatars.component';


@NgModule({
    imports: [
    CommonModule,
    AvatarsRoutingModule,
    AvatarsComponent
]
})
export class AvatarsModule { }
