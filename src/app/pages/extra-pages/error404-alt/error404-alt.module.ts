import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Error404AltRoutingModule } from './error404-alt-routing.module';
import { Error404AltComponent } from './error404-alt.component';


@NgModule({
  declarations: [
    Error404AltComponent
  ],
  imports: [
    CommonModule,
    Error404AltRoutingModule
  ]
})
export class Error404AltModule { }
