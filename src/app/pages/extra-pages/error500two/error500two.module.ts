import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiModule } from 'src/app/shared/ui/ui.module';
import { Error500twoRoutingModule } from './error500two-routing.module';
import { Error500twoComponent } from './error500two.component';


@NgModule({
  declarations: [
    Error500twoComponent
  ],
  imports: [
    CommonModule,
    UiModule,
    Error500twoRoutingModule
  ]
})
export class Error500twoModule { }
