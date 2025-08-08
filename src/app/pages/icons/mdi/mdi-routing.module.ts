import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MdiComponent } from './mdi.component';

const routes: Routes = [{ path: '', component: MdiComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MdiRoutingModule { }
