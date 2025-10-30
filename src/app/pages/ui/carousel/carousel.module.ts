import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

import { CarouselRoutingModule } from './carousel-routing.module';
import { CarouselComponent } from './carousel.component';


@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    NgbCarouselModule,
    CarouselRoutingModule,
    CarouselComponent
]
})
export class CarouselModule { }
