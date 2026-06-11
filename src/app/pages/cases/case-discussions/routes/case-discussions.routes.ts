import { Routes } from '@angular/router';

export const CASE_DISCUSSION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../pages/case-discussion-list/case-discussion-list.component').then((m) => m.CaseDiscussionListComponent),
    title: 'Discusiones del caso',
    data: {
      breadcrumb: 'Discusiones del caso',
    },
  },
  {
    path: 'new',
    loadComponent: () =>
      import('../pages/case-discussion-form/case-discussion-form.component').then((m) => m.CaseDiscussionFormComponent),
    title: 'Nueva discusión del caso',
    data: {
      breadcrumb: 'Nueva discusión',
    },
  },
  {
    path: ':discussionId',
    loadComponent: () =>
      import('../pages/case-discussion-detail/case-discussion-detail.component').then(
        (m) => m.CaseDiscussionDetailComponent,
      ),
    title: 'Detalle discusión del caso',
    data: {
      breadcrumb: 'Detalle discusión',
    },
  },
  {
    path: ':discussionId/edit',
    loadComponent: () =>
      import('../pages/case-discussion-form/case-discussion-form.component').then((m) => m.CaseDiscussionFormComponent),
    title: 'Editar discusión del caso',
    data: {
      breadcrumb: 'Editar discusión',
    },
  },
];
