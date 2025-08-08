import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404AltComponent } from './error404-alt.component';

const routes: Routes = [{ path: '', component: Error404AltComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Error404AltRoutingModule { }
