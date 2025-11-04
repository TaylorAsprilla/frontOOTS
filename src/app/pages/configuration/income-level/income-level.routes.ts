import { Routes } from '@angular/router';

export const INCOME_LEVEL_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./income-level-list/income-level-list.component').then((m) => m.IncomeLevelListComponent),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./income-level-form/income-level-form.component').then((m) => m.IncomeLevelFormComponent),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./income-level-form/income-level-form.component').then((m) => m.IncomeLevelFormComponent),
  },
];
