import { Routes } from '@angular/router';

export const DOCUMENT_TYPE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./document-type-list/document-type-list.component').then((m) => m.DocumentTypeListComponent),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./document-type-form/document-type-form.component').then((m) => m.DocumentTypeFormComponent),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./document-type-form/document-type-form.component').then((m) => m.DocumentTypeFormComponent),
  },
];
