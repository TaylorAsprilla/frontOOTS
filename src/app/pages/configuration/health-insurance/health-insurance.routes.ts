import { Routes } from '@angular/router';

export const HEALTH_INSURANCE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./health-insurance-list/health-insurance-list.component').then((m) => m.HealthInsuranceListComponent),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./health-insurance-form/health-insurance-form.component').then((m) => m.HealthInsuranceFormComponent),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./health-insurance-form/health-insurance-form.component').then((m) => m.HealthInsuranceFormComponent),
  },
];
