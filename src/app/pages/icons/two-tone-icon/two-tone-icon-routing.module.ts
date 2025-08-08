import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TwoToneIconComponent } from './two-tone-icon.component';

const routes: Routes = [{ path: '', component: TwoToneIconComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TwoToneIconRoutingModule { }
