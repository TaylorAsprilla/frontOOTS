import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DetailsRoutingModule } from './details-routing.module';
import { DetailsComponent } from './details.component';


@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    DetailsRoutingModule,
    DetailsComponent
]
})
export class DetailsModule { }
