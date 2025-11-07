import { Routes } from '@angular/router';
import { documentTypesResolver } from '../../core/resolvers/document-types.resolver';

/**
 * Rutas escalables para el módulo de gestión de usuarios
 * Implementa lazy loading con standalone components
 */
export const USER_MANAGEMENT_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'details',
    title: 'User Details',
    loadComponent: () => import('./user-details/user-details.component').then((c) => c.UserDetailsComponent),
    data: {
      breadcrumb: 'User Details',
      description: 'View detailed information about users',
    },
  },
  {
    path: 'details/:id',
    title: 'User Profile',
    loadComponent: () => import('./user-details/user-details.component').then((c) => c.UserDetailsComponent),
    data: {
      breadcrumb: 'User Profile',
      description: 'View and edit specific user profile',
    },
  },
  {
    path: 'create',
    title: 'Create User',
    loadComponent: () => import('./user-create/user-create.component').then((c) => c.UserCreateComponent),
    resolve: {
      documentTypes: documentTypesResolver,
    },
    data: {
      breadcrumb: 'Create User',
      description: 'Create a new user in the system',
    },
  },

  {
    path: '**',
    redirectTo: 'list',
  },
];
