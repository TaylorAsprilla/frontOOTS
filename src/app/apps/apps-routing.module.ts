import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // Standalone components already converted
  {
    path: 'social-feed',
    loadComponent: () => import('./social-feed/social-feed.component').then((c) => c.SocialFeedComponent),
  },
  { path: 'projects/list', loadComponent: () => import('./projects/list/list.component').then((c) => c.ListComponent) },
  {
    path: 'projects/details',
    loadComponent: () => import('./projects/detail/detail.component').then((c) => c.DetailComponent),
  },
  { path: 'tasks/list', loadComponent: () => import('./tasks/list/list.component').then((c) => c.ListComponent) },
  {
    path: 'tasks/details',
    loadComponent: () => import('./tasks/details/details.component').then((c) => c.DetailsComponent),
  },
  {
    path: 'tasks/kanban',
    loadComponent: () => import('./tasks/kanban/kanban.component').then((c) => c.KanbanComponent),
  },
  { path: 'tickets', loadChildren: () => import('./tickets/tickets.module').then((m) => m.TicketsModule) },
  { path: 'contacts', loadChildren: () => import('./contacts/contacts.module').then((m) => m.ContactsModule) },
  // Modules that still need conversion (temporarily commented out)
  // { path: 'calendar', loadChildren: () => import('./calendar/calendar.module').then(m => m.CalendarModule) },
  // { path: 'chat', loadChildren: () => import('./chat/chat.module').then(m => m.ChatModule) },
  // { path: 'ecommerce', loadChildren: () => import('./ecommerce/ecommerce.module').then(m => m.EcommerceModule) },
  // { path: 'crm', loadChildren: () => import('./crm/crm.module').then(m => m.CrmModule) },
  // { path: 'email', loadChildren: () => import('./email/email.module').then(m => m.EmailModule) },
  // { path: 'companies', loadChildren: () => import('./companies/companies.module').then(m => m.CompaniesModule) },
  // { path: 'projects', loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule) },
  // { path: 'tasks', loadChildren: () => import('./tasks/tasks.module').then(m => m.TasksModule) },
  // { path: 'file-manager', loadChildren: () => import('./file-manager/file-manager.module').then(m => m.FileManagerModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppsRoutingModule {}
