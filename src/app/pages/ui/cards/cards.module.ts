import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { CardsRoutingModule } from './cards-routing.module';
import { CardsComponent } from './cards.component';


@NgModule({
    imports: [
    CommonModule,
    NgbNavModule,
    CardsRoutingModule,
    CardsComponent
]
})
export class CardsModule { }
