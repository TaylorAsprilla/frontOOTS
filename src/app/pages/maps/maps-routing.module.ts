import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'googlemaps', loadChildren: () => import('./google-map/google-map.module').then(m => m.GoogleMapModule) },
  { path: 'vectormaps', loadChildren: () => import('./vector-maps/vector-maps.module').then(m => m.VectorMapsModule) }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapsRoutingModule { }
