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
    // Usar ruta absoluta basada en el baseHref del documento
    const baseHref = document.querySelector('base')?.getAttribute('href') || '/';
    const path = `${baseHref}assets/i18n/${lang}.json`;
    return this.http.get<Translation>(path);
  }
}

/**
 * Configuración principal de Transloco
 */
export const translocoAppConfig = translocoConfig({
  availableLangs: ['es', 'en'],
  defaultLang: 'es',
  // Re-render when language changes
  reRenderOnLangChange: true,
  // Remove missing translation handler in production
  prodMode: !isDevMode(),
  // Enable missing translation handler only in development
  missingHandler: {
    // Use the key as a fallback
    useFallbackTranslation: true,
  },
  // Flatten the translation object
  flatten: {
    aot: !isDevMode(),
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
