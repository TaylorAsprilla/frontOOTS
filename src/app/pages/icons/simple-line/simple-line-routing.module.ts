import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SimpleLineComponent } from './simple-line.component';

const routes: Routes = [{ path: '', component: SimpleLineComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SimpleLineRoutingModule { }
