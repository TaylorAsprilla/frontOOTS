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
    path: 'edit/:id',
    title: 'Editar Usuario',
    loadComponent: () => import('./user-create/user-create.component').then((c) => c.UserCreateComponent),
    resolve: {
      documentTypes: documentTypesResolver,
    },
    data: {
      breadcrumb: 'Editar Usuario',
      description: 'Edit an existing user profile',
    },
  },
  {
    path: 'profile',
    title: 'Mi Perfil',
    loadComponent: () => import('./my-profile/my-profile.component').then((c) => c.MyProfileComponent),
    data: {
      breadcrumb: 'Mi Perfil',
    },
  },
  {
    path: 'sessions',
    title: 'Sesiones Activas',
    loadComponent: () => import('./active-sessions/active-sessions.component').then((c) => c.ActiveSessionsComponent),
    data: { breadcrumb: 'Sesiones Activas' },
  },
  {
    path: 'login-history',
    title: 'Historial de Accesos',
    loadComponent: () => import('./login-history/login-history.component').then((c) => c.LoginHistoryComponent),
    data: { breadcrumb: 'Historial de Accesos' },
  },
  {
    path: 'audit-logs',
    title: 'Registro de Auditoría',
    canActivate: [roleGuard(['ADMIN', 'COORDINADOR', 'SUPERVISOR'])],
    loadComponent: () => import('./audit-logs/audit-logs.component').then((c) => c.AuditLogsComponent),
    data: { breadcrumb: 'Auditoría' },
  },

  {
    path: '**',
    redirectTo: 'list',
  },
];
