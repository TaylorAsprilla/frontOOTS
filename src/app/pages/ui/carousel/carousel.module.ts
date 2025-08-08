import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { CarouselRoutingModule } from './carousel-routing.module';
import { CarouselComponent } from './carousel.component';


@NgModule({
  declarations: [
    CarouselComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbCarouselModule,
    PageTitleModule,
    CarouselRoutingModule
  ]
})
export class CarouselModule { }
