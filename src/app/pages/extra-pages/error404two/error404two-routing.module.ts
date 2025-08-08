import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404twoComponent } from './error404two.component';

const routes: Routes = [{ path: '', component: Error404twoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Error404twoRoutingModule { }
