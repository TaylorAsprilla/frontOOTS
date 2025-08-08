import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SocialFeedComponent } from './social-feed.component';

const routes: Routes = [{
  path: '',
  component: SocialFeedComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SocialFeedRoutingModule { }
