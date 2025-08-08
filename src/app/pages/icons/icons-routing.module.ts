import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'font-awesome', loadChildren: () => import('./font-awesome/font-awesome.module').then(m => m.FontAwesomeModule) },
  { path: 'mdi', loadChildren: () => import('./mdi/mdi.module').then(m => m.MdiModule) },
  { path: 'dripicons', loadChildren: () => import('./dripicons/dripicons.module').then(m => m.DripiconsModule) },
  { path: 'two-tone', loadChildren: () => import('./two-tone-icon/two-tone-icon.module').then(m => m.TwoToneIconModule) },
  { path: 'feather', loadChildren: () => import('./feather/feather.module').then(m => m.FeatherModule) },
  { path: 'weather', loadChildren: () => import('./weather/weather.module').then(m => m.WeatherModule) },
  { path: 'themify', loadChildren: () => import('./themify/themify.module').then(m => m.ThemifyModule) },
  { path: 'simple-line', loadChildren: () => import('./simple-line/simple-line.module').then(m => m.SimpleLineModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IconsRoutingModule { }
