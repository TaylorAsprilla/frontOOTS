import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'basic', loadChildren: () => import('./basic-table/basic-table.module').then(m => m.BasicTableModule) },
  { path: 'advanced', loadChildren: () => import('./advance/advance.module').then(m => m.AdvanceModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TablesRoutingModule { }
