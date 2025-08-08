import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
  path: 'apex',
  loadChildren: () => import('./apex/apex.module').then(m => m.ApexModule)
},
{
  path: 'chartjs',
  loadChildren: () => import('./chartjs/chartjs.module').then(m => m.ChartjsModule)
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChartsRoutingModule { }
