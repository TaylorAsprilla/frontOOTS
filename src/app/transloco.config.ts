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
    // Asegurarse de que la ruta termine correctamente
    const normalizedBaseHref = baseHref.endsWith('/') ? baseHref : `${baseHref}/`;
    const path = `${normalizedBaseHref}assets/i18n/${lang}.json`;

    // Log para debugging (se puede remover después)
    console.log('🌐 Loading translation:', { lang, baseHref, normalizedBaseHref, path });

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
  // Keep prodMode false to see errors in production during testing
  prodMode: false, // Cambiado temporalmente para debug
  // Enable missing translation handler
  missingHandler: {
    // Use the key as a fallback
    useFallbackTranslation: true,
    logMissingKey: true, // Log para ver qué traducciones faltan
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
