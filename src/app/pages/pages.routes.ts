import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard-one/dashboard-one.component').then((c) => c.DashboardOneComponent),
  },
  { path: 'icons', loadChildren: () => import('./icons/icons-routing.module') },
  {
    path: 'users',
    title: 'User Management',
    loadChildren: () => import('./user-management/user-management.routes').then((r) => r.USER_MANAGEMENT_ROUTES),
    data: {
      breadcrumb: 'User Management',
      description: 'Comprehensive user management system',
    },
  },
  {
    path: 'participants',
    title: 'Participants Management',
    loadChildren: () => import('./participants/participants.routes').then((r) => r.PARTICIPANTS_ROUTES),
    data: {
      breadcrumb: 'Participants',
      description: 'Comprehensive participants management system',
    },
  },
  {
    path: 'cases',
    title: 'Cases Management',
    loadChildren: () => import('./cases/cases.routes').then((r) => r.CASES_ROUTES),
    data: {
      breadcrumb: 'Cases',
      description: 'Comprehensive cases management system',
    },
  },
  // --- Disabled (temporal) ---
  // { path: 'pages', loadChildren: () => import('./extra-pages/extra-pages.module').then(m => m.ExtraPagesModule) },
  // { path: 'charts', loadChildren: () => import('./charts/charts.module').then(m => m.ChartsModule) },
  // { path: 'widgets', loadChildren: () => import('./widgets/widgets.module').then(m => m.WidgetsModule) },
  // { path: 'ui', loadChildren: () => import('./ui/ui-routing.module') },
  // { path: 'forms', loadChildren: () => import('./forms/forms-routing.module') },
  // { path: 'extended-ui', loadChildren: () => import('./extended-ui/extended-ui.module').then(m => m.ExtendedUiModule) },
  // { path: 'tables', loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule) },
  // { path: 'landing', loadComponent: () => import('./landing/landing.component').then(c => c.LandingComponent) },
  // { path: 'maps', loadChildren: () => import('./extra-pages/extra-pages.module').then(m => m.ExtraPagesModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
