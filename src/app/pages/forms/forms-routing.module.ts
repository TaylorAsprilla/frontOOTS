import { Routes } from '@angular/router';

const routes: Routes = [
  { path: 'basic', loadChildren: () => import('./basic/basic.module').then((m) => m.BasicModule) },
  { path: 'advanced', loadChildren: () => import('./advanced/advanced.module').then((m) => m.AdvancedModule) },
  { path: 'validation', loadChildren: () => import('./validation/validation.module').then((m) => m.ValidationModule) },
  { path: 'wizard', loadComponent: () => import('./wizard/wizard.component').then((c) => c.WizardComponent) },
  { path: 'upload', loadChildren: () => import('./upload/upload.module').then((m) => m.UploadModule) },
  { path: 'editors', loadChildren: () => import('./editors/editors.module').then((m) => m.EditorsModule) },
];

export default routes;
