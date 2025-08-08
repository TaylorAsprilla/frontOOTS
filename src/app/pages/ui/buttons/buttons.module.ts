import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbButtonsModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { ButtonsRoutingModule } from './buttons-routing.module';
import { ButtonsComponent } from './buttons.component';


@NgModule({
  declarations: [
    ButtonsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbButtonsModule,
    NgbDropdownModule,
    ButtonsRoutingModule
]
})
export class ButtonsModule { }
