import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlaceholdersRoutingModule } from './placeholders-routing.module';
import { PlaceholdersComponent } from './placeholders.component';


@NgModule({
    imports: [
    CommonModule,
    PlaceholdersRoutingModule,
    PlaceholdersComponent
]
})
export class PlaceholdersModule { }
