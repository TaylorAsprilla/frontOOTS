import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiModule } from 'src/app/shared/ui/ui.module';
import { Error404twoRoutingModule } from './error404two-routing.module';
import { Error404twoComponent } from './error404two.component';


@NgModule({
  declarations: [
    Error404twoComponent
  ],
  imports: [
    CommonModule,
    UiModule,
    Error404twoRoutingModule
  ]
})
export class Error404twoModule { }
