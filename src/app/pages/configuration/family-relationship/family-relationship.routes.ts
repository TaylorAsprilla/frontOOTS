import { Routes } from '@angular/router';

export const FAMILY_RELATIONSHIP_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./family-relationship-list/family-relationship-list.component').then(
        (m) => m.FamilyRelationshipListComponent
      ),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./family-relationship-form/family-relationship-form.component').then(
        (m) => m.FamilyRelationshipFormComponent
      ),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./family-relationship-form/family-relationship-form.component').then(
        (m) => m.FamilyRelationshipFormComponent
      ),
  },
];
