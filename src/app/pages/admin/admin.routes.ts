import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';

/**
 * Rutas de la sección Administrador.
 *
 * Toda la sección está protegida con `roleGuard(['ADMIN'])`:
 * un usuario sin rol ADMIN que intente entrar por URL directa
 * será redirigido al dashboard por el guard.
 *
 * Pensado para crecer en el futuro con más opciones administrativas
 * (usuarios, países, auditoría, etc.).
 */
export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard(['ADMIN'])],
    canActivateChild: [roleGuard(['ADMIN'])],
    children: [
      { path: '', redirectTo: 'participants', pathMatch: 'full' },
      {
        path: 'participants',
        loadComponent: () =>
          import('./participants/admin-participants-list.component').then((m) => m.AdminParticipantsListComponent),
        title: 'Administrator - Participants',
        data: {
          breadcrumb: 'adminParticipants.title',
        },
      },
      {
        path: 'cases',
        loadComponent: () => import('./cases/admin-cases-list.component').then((m) => m.AdminCasesListComponent),
        title: 'Administrator - Cases',
        data: {
          breadcrumb: 'adminCases.title',
        },
      },
      { path: '**', redirectTo: 'participants' },
    ],
  },
];
