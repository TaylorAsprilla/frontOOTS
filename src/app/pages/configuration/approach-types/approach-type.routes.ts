import { Routes } from '@angular/router';

export const APPROACH_TYPE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./approach-type-list/approach-type-list.component').then((m) => m.ApproachTypeListComponent),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./approach-type-form/approach-type-form.component').then((m) => m.ApproachTypeFormComponent),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./approach-type-form/approach-type-form.component').then((m) => m.ApproachTypeFormComponent),
  },
];
