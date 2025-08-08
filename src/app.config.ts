import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Title } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { JoyrideModule } from 'ngx-joyride';
import { JwtInterceptor } from './app/core/helpers/jwt.interceptor';
import { ErrorInterceptor } from './app/core/helpers/error.interceptor';
import { FakeBackendProvider } from './app/core/helpers/fake-backend';
import { routes } from './app/app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
  provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    importProvidersFrom(
      // Reutiliza tus NgModules existentes:

      JoyrideModule.forRoot(),
      SweetAlert2Module.forRoot()
    ),
    Title,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    FakeBackendProvider,
  ],
};
