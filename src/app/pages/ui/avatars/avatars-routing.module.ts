import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AvatarsComponent } from './avatars.component';

const routes: Routes = [{ path: '', component: AvatarsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AvatarsRoutingModule { }
