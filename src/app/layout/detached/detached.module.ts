import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetachedLayoutComponent } from './layout/layout.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    DetachedLayoutComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  exports: [
    DetachedLayoutComponent
  ]
})
export class DetachedModule { }
