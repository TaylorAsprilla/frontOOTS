import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'dragdrop', loadChildren: () => import('./drag-drop/drag-drop.module').then(m => m.DragDropModule) },
  { path: 'rangesliders', loadChildren: () => import('./range-sliders/range-sliders.module').then(m => m.RangeSlidersModule) },
  { path: 'animation', loadChildren: () => import('./animation/animation.module').then(m => m.AnimationModule) },
  { path: 'sweet-alert', loadChildren: () => import('./sweet-alert/sweet-alert.module').then(m => m.SweetAlertModule) },
  { path: 'tour', loadChildren: () => import('./tour-page/tour-page.module').then(m => m.TourPageModule) },
  { path: 'loading-buttons', loadChildren: () => import('./loading-buttons/loading-buttons.module').then(m => m.LoadingButtonsModule) }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExtendedUiRoutingModule { }
