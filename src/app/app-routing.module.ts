import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LayoutContainerComponent } from './layout/layout-container.component';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';

const routes: Routes = [

  {
    path: '',
    component: LayoutContainerComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
      },
      {
        path: 'apps',
        loadChildren: () => import('./apps/apps.module').then(m => m.AppsModule),
      },
    ]
  },
  {
    path: 'auth',
    component: PublicLayoutComponent,
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'maintenance',
    component: PublicLayoutComponent,
    loadChildren: () => import('./pages/extra-pages/maintenance/maintenance.module').then(m => m.MaintenanceModule)
  },
  {
    path: 'upcoming',
    component: PublicLayoutComponent,
    loadChildren: () => import('./pages/extra-pages/upcoming/upcoming.module').then(m => m.UpcomingModule)
  },
  {
    path: 'error-404',
    component: PublicLayoutComponent,
    loadChildren: () => import('./pages/extra-pages/error404/error404.module').then(m => m.Error404Module)
  },
  {
    path: 'error-404-two',
    component: PublicLayoutComponent,
    loadChildren: () => import('./pages/extra-pages/error404two/error404two.module').then(m => m.Error404twoModule)
  },
  {
    path: 'error-500-two',
    component: PublicLayoutComponent,
    loadChildren: () => import('./pages/extra-pages/error500two/error500two.module').then(m => m.Error500twoModule)
  },
  {
    path: 'error-500',
    component: PublicLayoutComponent,
    loadChildren: () => import('./pages/extra-pages/error500/error500.module').then(m => m.Error500Module)
  },
  {
    path: 'landing',
    component: PublicLayoutComponent,
    loadChildren: () => import('./pages/landing/landing.module').then(m => m.LandingModule)
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
