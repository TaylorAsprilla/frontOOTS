import { NgModule } from '@angular/core';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './account/login/login.component';
import { ConfirmMailComponent } from './account/confirm-mail/confirm-mail.component';
import { LogoutComponent } from './account/logout/logout.component';
import { RecoverPasswordComponent } from './account/recover-password/recover-password.component';

@NgModule({
  imports: [AuthRoutingModule, LoginComponent, ConfirmMailComponent, LogoutComponent, RecoverPasswordComponent],
})
export class AuthModule {}
