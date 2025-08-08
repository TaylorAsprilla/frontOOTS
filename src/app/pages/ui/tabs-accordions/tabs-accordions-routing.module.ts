import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsAccordionsComponent } from './tabs-accordions.component';

const routes: Routes = [{ path: '', component: TabsAccordionsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsAccordionsRoutingModule { }
