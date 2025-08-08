import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadingButtonsComponent } from './loading-buttons.component';

const routes: Routes = [{ path: '', component: LoadingButtonsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoadingButtonsRoutingModule { }
