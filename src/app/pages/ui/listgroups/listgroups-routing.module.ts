import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListgroupsComponent } from './listgroups.component';

const routes: Routes = [{ path: '', component: ListgroupsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListgroupsRoutingModule { }
