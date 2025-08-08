import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



import { ListRoutingModule } from './list-routing.module';
import { ListComponent } from './list.component';

@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    ListRoutingModule,
    ListComponent
]
})
export class ListModule { }
