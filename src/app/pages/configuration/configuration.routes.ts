import { Routes } from '@angular/router';

export const CONFIGURATION_ROUTES: Routes = [
  {
    path: 'academic-level',
    loadChildren: () => import('./academic-level/academic-level.routes').then((m) => m.ACADEMIC_LEVEL_ROUTES),
  },
  {
    path: 'approach-types',
    loadChildren: () => import('./approach-types/approach-type.routes').then((m) => m.APPROACH_TYPE_ROUTES),
  },
  {
    path: 'document-types',
    loadChildren: () => import('./document-types/document-type.routes').then((m) => m.DOCUMENT_TYPE_ROUTES),
  },
  {
    path: 'family-relationship',
    loadChildren: () =>
      import('./family-relationship/family-relationship.routes').then((m) => m.FAMILY_RELATIONSHIP_ROUTES),
  },
  {
    path: 'genders',
    loadChildren: () => import('./genders/gender.routes').then((m) => m.GENDER_ROUTES),
  },
  {
    path: 'health-insurance',
    loadChildren: () => import('./health-insurance/health-insurance.routes').then((m) => m.HEALTH_INSURANCE_ROUTES),
  },
  {
    path: 'housing-type',
    loadChildren: () => import('./housing-type/housing-type.routes').then((m) => m.HOUSING_TYPE_ROUTES),
  },
  {
    path: 'identified-situations',
    loadChildren: () =>
      import('./identified-situations/identified-situation.routes').then((m) => m.IDENTIFIED_SITUATION_ROUTES),
  },
  {
    path: 'income-level',
    loadChildren: () => import('./income-level/income-level.routes').then((m) => m.INCOME_LEVEL_ROUTES),
  },
  {
    path: 'income-source',
    loadChildren: () => import('./income-source/income-source.routes').then((m) => m.INCOME_SOURCE_ROUTES),
  },
  {
    path: 'marital-status',
    loadChildren: () => import('./marital-status/marital-status.routes').then((m) => m.MARITAL_STATUS_ROUTES),
  },
  {
    path: '',
    redirectTo: 'academic-level',
    pathMatch: 'full',
  },
];
