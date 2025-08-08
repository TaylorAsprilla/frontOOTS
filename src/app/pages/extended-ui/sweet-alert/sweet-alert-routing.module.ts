import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SweetAlertComponent } from './sweet-alert.component';

const routes: Routes = [{
  path: '',
  component: SweetAlertComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SweetAlertRoutingModule { }
