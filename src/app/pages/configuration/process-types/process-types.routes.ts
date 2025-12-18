import { Routes } from '@angular/router';

export const PROCESS_TYPES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./process-types-list/process-types-list.component').then((m) => m.ProcessTypesListComponent),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./process-types-form/process-types-form.component').then((m) => m.ProcessTypesFormComponent),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./process-types-form/process-types-form.component').then((m) => m.ProcessTypesFormComponent),
  },
];
