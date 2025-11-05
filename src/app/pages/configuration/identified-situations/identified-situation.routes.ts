import { Routes } from '@angular/router';

export const IDENTIFIED_SITUATION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./identified-situation-list/identified-situation-list.component').then(
        (m) => m.IdentifiedSituationListComponent
      ),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./identified-situation-form/identified-situation-form.component').then(
        (m) => m.IdentifiedSituationFormComponent
      ),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./identified-situation-form/identified-situation-form.component').then(
        (m) => m.IdentifiedSituationFormComponent
      ),
  },
];
