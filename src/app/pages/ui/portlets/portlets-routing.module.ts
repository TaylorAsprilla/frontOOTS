import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortletsComponent } from './portlets.component';

const routes: Routes = [{ path: '', component: PortletsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortletsRoutingModule { }
