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
    path: '',
    redirectTo: 'academic-level',
    pathMatch: 'full',
  },
];
