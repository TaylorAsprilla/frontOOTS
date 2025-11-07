import { Routes } from '@angular/router';

export const INCOME_SOURCE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./income-source-list/income-source-list.component').then((m) => m.IncomeSourceListComponent),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./income-source-form/income-source-form.component').then((m) => m.IncomeSourceFormComponent),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./income-source-form/income-source-form.component').then((m) => m.IncomeSourceFormComponent),
  },
];
