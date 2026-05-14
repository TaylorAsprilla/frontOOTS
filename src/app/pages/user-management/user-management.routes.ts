import { Routes } from '@angular/router';
import { documentTypesResolver } from '../../core/resolvers/document-types.resolver';
import { roleGuard } from '../../core/guards/role.guard';

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
    title: 'user.details',
    loadComponent: () => import('./user-details/user-details.component').then((c) => c.UserDetailsComponent),
    data: {
      breadcrumb: 'user.details',
      description: 'View detailed information about users',
    },
  },
  {
    path: 'details/:id',
    title: 'profile.title',
    loadComponent: () => import('./user-details/user-details.component').then((c) => c.UserDetailsComponent),
    data: {
      breadcrumb: 'profile.title',
      description: 'View and edit specific user profile',
    },
  },
  {
    path: 'create',
    title: 'user.createNewUser',
    loadComponent: () => import('./user-create/user-create.component').then((c) => c.UserCreateComponent),
    resolve: {
      documentTypes: documentTypesResolver,
    },
    data: {
      breadcrumb: 'user.createNewUser',
      description: 'Create a new user in the system',
    },
  },
  {
    path: 'edit/:id',
    title: 'user.editUser',
    loadComponent: () => import('./user-create/user-create.component').then((c) => c.UserCreateComponent),
    resolve: {
      documentTypes: documentTypesResolver,
    },
    data: {
      breadcrumb: 'user.editUser',
      description: 'Edit an existing user profile',
    },
  },
  {
    path: 'profile',
    title: 'profile.title',
    loadComponent: () => import('./my-profile/my-profile.component').then((c) => c.MyProfileComponent),
    data: {
      breadcrumb: 'profile.title',
    },
  },
  {
    path: 'sessions',
    title: 'auth.sessions.title',
    loadComponent: () => import('./active-sessions/active-sessions.component').then((c) => c.ActiveSessionsComponent),
    data: { breadcrumb: 'auth.sessions.title' },
  },
  {
    path: 'login-history',
    title: 'auth.loginHistory.title',
    loadComponent: () => import('./login-history/login-history.component').then((c) => c.LoginHistoryComponent),
    data: { breadcrumb: 'auth.loginHistory.title' },
  },
  {
    path: 'audit-logs',
    title: 'audit.title',
    canActivate: [roleGuard(['ADMIN', 'COORDINADOR', 'SUPERVISOR'])],
    loadComponent: () => import('./audit-logs/audit-logs.component').then((c) => c.AuditLogsComponent),
    data: { breadcrumb: 'audit.title' },
  },

  {
    path: '**',
    redirectTo: 'list',
  },
];
