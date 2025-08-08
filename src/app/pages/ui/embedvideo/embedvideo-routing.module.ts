import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmbedvideoComponent } from './embedvideo.component';

const routes: Routes = [{ path: '', component: EmbedvideoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmbedvideoRoutingModule { }
