import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TourPageComponent } from './tour-page.component';

const routes: Routes = [{ path: '', component: TourPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TourPageRoutingModule { }
