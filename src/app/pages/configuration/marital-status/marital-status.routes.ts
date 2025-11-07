import { Routes } from '@angular/router';

export const MARITAL_STATUS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./marital-status-list/marital-status-list.component').then((m) => m.MaritalStatusListComponent),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./marital-status-form/marital-status-form.component').then((m) => m.MaritalStatusFormComponent),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./marital-status-form/marital-status-form.component').then((m) => m.MaritalStatusFormComponent),
  },
];
