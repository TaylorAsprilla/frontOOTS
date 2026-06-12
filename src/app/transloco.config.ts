import { HttpClient } from '@angular/common/http';
import { inject, Injectable, isDevMode } from '@angular/core';
import { Translation, translocoConfig, TranslocoLoader, TranslocoModule } from '@ngneat/transloco';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

/**
 * HTTP Loader para cargar traducciones desde assets/i18n/
 */
@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoaderService implements TranslocoLoader {
  private http = inject(HttpClient);

  getTranslation(lang: string): Observable<Translation> {
    // Construir la ruta normalizando para evitar dobles slashes ("//"),
    // que en CloudFront caen en el SPA fallback y devuelven index.html.
    const rawBaseHref = document.querySelector('base')?.getAttribute('href') || '/';
    // Quita todos los slashes finales del baseHref y los slashes iniciales del lang.
    const baseHref = rawBaseHref.replace(/\/+$/, '');
    const safeLang = String(lang).replace(/^\/+/, '');
    const path = `${baseHref}/assets/i18n/${safeLang}.json`;

    return this.http.get(path, { responseType: 'text' }).pipe(
      map((raw) => {
        // Defensa contra CloudFront/S3 que devuelve index.html (HTML) en vez del JSON
        const trimmed = (raw ?? '').trim();
        if (!trimmed || trimmed.startsWith('<')) {
          console.error(
            `[Transloco] La respuesta para "${path}" no es JSON v\u00e1lido. ` +
              `Revisa el deploy: el archivo no existe o CloudFront est\u00e1 devolviendo index.html.`,
          );
          return {} as Translation;
        }
        try {
          return JSON.parse(trimmed) as Translation;
        } catch (e) {
          console.error(`[Transloco] No se pudo parsear "${path}":`, e);
          return {} as Translation;
        }
      }),
      catchError((err) => {
        console.error(`[Transloco] Error cargando "${path}":`, err);
        return of({} as Translation);
      }),
    );
  }
}

/**
 * Configuración principal de Transloco
 */
export const translocoAppConfig = translocoConfig({
  availableLangs: [
    { id: 'es-CO', label: 'Español (Colombia)' },
    { id: 'es-PR', label: 'Español (Puerto Rico)' },
    { id: 'en', label: 'English' },
  ],
  defaultLang: 'es-CO',
  fallbackLang: 'es-CO',
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
