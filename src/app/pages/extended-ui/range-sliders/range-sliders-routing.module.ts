import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RangeSlidersComponent } from './range-sliders.component';

const routes: Routes = [{ path: '', component: RangeSlidersComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RangeSlidersRoutingModule { }
