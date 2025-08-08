import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeatherComponent } from './feather.component';

const routes: Routes = [{ path: '', component: FeatherComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeatherRoutingModule { }
