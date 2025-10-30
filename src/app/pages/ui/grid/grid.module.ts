import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridRoutingModule } from './grid-routing.module';
import { GridComponent } from './grid.component';


@NgModule({
    imports: [
    CommonModule,
    GridRoutingModule,
    GridComponent
]
})
export class GridModule { }
