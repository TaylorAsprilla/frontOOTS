import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Title } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideTransloco } from '@ngneat/transloco';

import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { JoyrideModule } from 'ngx-joyride';
import { JwtInterceptor } from './app/core/helpers/jwt.interceptor';
import { ErrorInterceptor } from './app/core/helpers/error.interceptor';
import { LoggingInterceptor } from './app/core/interceptors/logging.interceptor';
import { AuthInterceptor } from './app/core/interceptors/auth.interceptor';
// import { FakeBackendProvider } from './app/core/helpers/fake-backend'; // Disabled for real backend
import { routes } from './app/app.routes';
import { TranslocoHttpLoaderService, translocoAppConfig } from './app/transloco.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    provideTransloco({
      config: translocoAppConfig,
      loader: TranslocoHttpLoaderService,
    }),
    importProvidersFrom(
      // Reutiliza tus NgModules existentes:

      JoyrideModule.forRoot(),
      SweetAlert2Module.forRoot()
    ),
    Title,
    { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    // FakeBackendProvider, // Disabled - using real backend API
  ],
};
