import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RibbonsComponent } from './ribbons.component';

const routes: Routes = [{ path: '', component: RibbonsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RibbonsRoutingModule { }
