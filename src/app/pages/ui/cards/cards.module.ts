import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { CardsRoutingModule } from './cards-routing.module';
import { CardsComponent } from './cards.component';


@NgModule({
  declarations: [
    CardsComponent
  ],
  imports: [
    CommonModule,
    PageTitleModule,
    NgbNavModule,
    CardsRoutingModule
  ]
})
export class CardsModule { }
