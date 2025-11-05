import { HttpClient } from '@angular/common/http';
import { inject, Injectable, isDevMode } from '@angular/core';
import { Translation, translocoConfig, TranslocoLoader, TranslocoModule } from '@ngneat/transloco';
import { Observable } from 'rxjs';

/**
 * HTTP Loader para cargar traducciones desde assets/i18n/
 */
@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoaderService implements TranslocoLoader {
  private http = inject(HttpClient);

  getTranslation(lang: string): Observable<Translation> {
    // Obtener el baseHref del documento para construir la ruta correcta
    const baseHref = document.querySelector('base')?.getAttribute('href') || '/';
    const normalizedBaseHref = baseHref.endsWith('/') ? baseHref : `${baseHref}/`;
    const path = `${normalizedBaseHref}assets/i18n/${lang}.json`;

    return this.http.get<Translation>(path);
  }
}

/**
 * Configuración principal de Transloco
 */
export const translocoAppConfig = translocoConfig({
  availableLangs: ['es', 'en'],
  defaultLang: 'es',
  reRenderOnLangChange: true,
  prodMode: !isDevMode(),
  missingHandler: {
    useFallbackTranslation: true,
  },
  // Flatten desactivado porque usamos estructura anidada en los JSON
  flatten: {
    aot: false,
  },
});

/**
 * Factory function para la configuración
 */
export const translocoConfigFactory = () => translocoAppConfig;

/**
 * Re-export de TranslocoModule para facilitar importación
 */
export { TranslocoModule };
