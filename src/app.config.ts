import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { CountryService } from './app/core/services/country.service';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Title } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideTransloco, TranslocoService } from '@ngneat/transloco';

import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { JoyrideModule } from 'ngx-joyride';
import { JwtInterceptor } from './app/core/helpers/jwt.interceptor';
import { ErrorInterceptor } from './app/core/helpers/error.interceptor';
import { LoggingInterceptor } from './app/core/interceptors/logging.interceptor';
import { AuthInterceptor } from './app/core/interceptors/auth.interceptor';
// import { FakeBackendProvider } from './app/core/helpers/fake-backend'; // Disabled for real backend
import { routes } from './app/app.routes';
import { TranslocoHttpLoaderService, translocoAppConfig } from './app/transloco.config';

/**
 * Endurece TranslocoService.setActiveLang para que NUNCA se acepte un valor
 * vacio/null/undefined. Si llega algo invalido, mantiene el active lang actual.
 *
 * Esto evita el error en tiempo de ejecucion:
 *   "Cannot read properties of null (reading 'replace')"
 * que ocurre dentro de resolveLangAndScope -> getMappedScope -> toCamelCase
 * cuando el active lang termina siendo null (por ejemplo si un consumidor
 * llama setActiveLang con un valor no resuelto).
 */
function hardenTranslocoSetActiveLang(transloco: TranslocoService) {
  const original = transloco.setActiveLang.bind(transloco);
  transloco.setActiveLang = (lang: string) => {
    const safe = typeof lang === 'string' ? lang.trim() : '';
    if (!safe || safe === 'null' || safe === 'undefined') {
      // eslint-disable-next-line no-console
      console.warn(
        `[Transloco] setActiveLang ignorado por valor invalido: "${lang}". Se mantiene "${transloco.getActiveLang()}".`,
      );
      return transloco;
    }
    return original(safe);
  };
}

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
      SweetAlert2Module.forRoot(),
    ),
    Title,
    { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {
      provide: APP_INITIALIZER,
      useFactory: (transloco: TranslocoService) => () => {
        hardenTranslocoSetActiveLang(transloco);
      },
      deps: [TranslocoService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (countryService: CountryService) => () => countryService.loadCountries(),
      deps: [CountryService],
      multi: true,
    },
  ],
};
