import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TooltipsPopoversComponent } from './tooltips-popovers.component';

const routes: Routes = [{ path: '', component: TooltipsPopoversComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TooltipsPopoversRoutingModule { }
