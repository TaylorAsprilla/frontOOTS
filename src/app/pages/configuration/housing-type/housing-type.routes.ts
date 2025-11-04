import { Routes } from '@angular/router';

export const HOUSING_TYPE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./housing-type-list/housing-type-list.component').then((m) => m.HousingTypeListComponent),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./housing-type-form/housing-type-form.component').then((m) => m.HousingTypeFormComponent),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./housing-type-form/housing-type-form.component').then((m) => m.HousingTypeFormComponent),
  },
];
