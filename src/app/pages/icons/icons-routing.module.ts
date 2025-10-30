import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'font-awesome',
    loadComponent: () => import('./font-awesome/font-awesome.component').then((c) => c.FontAwesomeComponent),
  },
  { path: 'mdi', loadComponent: () => import('./mdi/mdi.component').then((c) => c.MdiComponent) },
  {
    path: 'two-tone',
    loadComponent: () => import('./two-tone-icon/two-tone-icon.component').then((c) => c.TwoToneIconComponent),
  },
  { path: 'feather', loadComponent: () => import('./feather/feather.component').then((c) => c.FeatherComponent) },
  { path: 'weather', loadComponent: () => import('./weather/weather.component').then((c) => c.WeatherComponent) },
  { path: 'themify', loadComponent: () => import('./themify/themify.component').then((c) => c.ThemifyComponent) },
  {
    path: 'simple-line',
    loadComponent: () => import('./simple-line/simple-line.component').then((c) => c.SimpleLineComponent),
  },
];

export default routes;
