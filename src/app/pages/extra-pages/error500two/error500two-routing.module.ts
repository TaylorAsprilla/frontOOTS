import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error500twoComponent } from './error500two.component';

const routes: Routes = [{ path: '', component: Error500twoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Error500twoRoutingModule { }
