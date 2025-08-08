import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Error404AltRoutingModule } from './error404-alt-routing.module';
import { Error404AltComponent } from './error404-alt.component';


@NgModule({
    imports: [
        CommonModule,
        Error404AltRoutingModule,
        Error404AltComponent
    ]
})
export class Error404AltModule { }
