import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmMailComponent } from './account/confirm-mail/confirm-mail.component';

import { LoginComponent } from './account/login/login.component';
import { LogoutComponent } from './account/logout/logout.component';
import { RecoverPasswordComponent } from './account/recover-password/recover-password.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    pathMatch: 'full',
  },
  {
    path: 'confirm',
    component: ConfirmMailComponent,
    pathMatch: 'full',
  },
  {
    path: 'reset-password',
    component: RecoverPasswordComponent,
    pathMatch: 'full',
  },
  {
    path: 'reset-password/:token',
    component: RecoverPasswordComponent,
    pathMatch: 'full',
  },
  {
    path: 'logout',
    component: LogoutComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
