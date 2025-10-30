import { Routes } from '@angular/router';

/**
 * Participants module routes configuration
 * Uses standalone components with lazy loading
 */
export const PARTICIPANTS_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    loadComponent: () =>
      import('./participant-list/participant-list.component').then((m) => m.ParticipantListComponent),
    title: 'Participants - List',
    data: {
      breadcrumb: 'participants.list',
    },
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./create-participant/create-participant.component').then((m) => m.CreateParticipantComponent),
    title: 'Participants - Create New',
    data: {
      breadcrumb: 'participants.create',
    },
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./create-participant/create-participant.component').then((m) => m.CreateParticipantComponent),
    title: 'Participants - Edit',
    data: {
      breadcrumb: 'participants.edit',
      mode: 'edit',
    },
  },
  {
    path: 'detail/:id',
    loadComponent: () =>
      import('./participant-detail/participant-detail.component').then((m) => m.ParticipantDetailComponent),
    title: 'Participants - Details',
    data: {
      breadcrumb: 'participants.detail',
    },
  },
  {
    path: '**',
    redirectTo: 'list',
  },
];
