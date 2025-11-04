import { Routes } from '@angular/router';

/**
 * Cases module routes configuration
 * Uses standalone components with lazy loading
 */
export const CASES_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    loadComponent: () => import('./case-list/case-list.component').then((m) => m.CaseListComponent),
    title: 'Cases - List',
    data: {
      breadcrumb: 'cases.list',
    },
  },
  {
    path: 'create/:participantId',
    loadComponent: () => import('./create-case/create-case.component').then((m) => m.CreateCaseComponent),
    title: 'Cases - Create New',
    data: {
      breadcrumb: 'cases.create',
    },
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./create-case/create-case.component').then((m) => m.CreateCaseComponent),
    title: 'Cases - Edit',
    data: {
      breadcrumb: 'cases.edit',
      mode: 'edit',
    },
  },
  {
    path: 'detail/:id',
    loadComponent: () => import('./case-detail/case-detail.component').then((m) => m.CaseDetailComponent),
    title: 'Cases - Details',
    data: {
      breadcrumb: 'cases.detail',
    },
  },
  {
    path: '**',
    redirectTo: 'list',
  },
];
