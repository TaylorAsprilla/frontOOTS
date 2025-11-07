import { Routes } from '@angular/router';

export const GENDER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./gender-list/gender-list.component').then((m) => m.GenderListComponent),
  },
  {
    path: 'create',
    loadComponent: () => import('./gender-form/gender-form.component').then((m) => m.GenderFormComponent),
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./gender-form/gender-form.component').then((m) => m.GenderFormComponent),
  },
];
