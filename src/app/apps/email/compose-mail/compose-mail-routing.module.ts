import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComposeMailComponent } from './compose-mail.component';

const routes: Routes = [{ path: '', component: ComposeMailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComposeMailRoutingModule { }
