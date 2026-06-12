import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

// Tipos dinámicos — ya no están atados a un union fijo
export type CountryCode = string;
export type SupportedLanguage = string;
export type BaseLanguage = 'es' | 'en';

export interface CountryConfig {
  id?: number;
  code: string;
  name: string;
  locale: string;
  currency: string;
  phonePrefix: string;
  flag: string;
}

export interface BackendCountry {
  id: number;
  name: string;
  iso: string;
  locale: string;
  currency: string;
  phonePrefix: string;
  flagUrl: string;
  defaultLanguage: string;
  isActive: boolean;
}

interface BackendCountriesResponse {
  data: BackendCountry[];
  statusCode: number;
  message: string;
}

interface CountriesCache {
  data: CountryConfig[];
  cachedAt: string;
}

const CACHE_KEY = 'countries_cache';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 horas
const DEFAULT_LANGUAGE = 'es-PR';

// Fallback mínimo si el backend falla y no hay caché
const FALLBACK_COUNTRIES: CountryConfig[] = [
  {
    id: 1,
    code: 'PR',
    name: 'Puerto Rico',
    locale: 'es-PR',
    currency: 'USD',
    phonePrefix: '+1',
    flag: 'https://flagcdn.com/w20/pr.png',
  },
];

// Normalización de locales del backend → locales de archivos i18n del frontend
const LOCALE_NORMALIZATION: Record<string, string> = {
  'en-US': 'en',
  'en-GB': 'en',
};

/**
 * Servicio para gestionar la configuración específica por país
 */
@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private countryConfigs: Record<string, CountryConfig> = {};

  private currentCountrySubject = new BehaviorSubject<string>('PR');
  public currentCountry$: Observable<string> = this.currentCountrySubject.asObservable();

  private currentLanguageSubject = new BehaviorSubject<string>(DEFAULT_LANGUAGE);
  public currentLanguage$: Observable<string> = this.currentLanguageSubject.asObservable();

  constructor(
    private translocoService: TranslocoService,
    private http: HttpClient,
  ) {}

  /**
   * Carga países desde backend (o caché).
   * Llamado por APP_INITIALIZER antes de que arranque la app.
   */
  loadCountries(): Observable<void> {
    const cached = this.getCache();
    if (cached) {
      this.applyConfigs(cached);
      return of(void 0);
    }

    return this.http.get<BackendCountriesResponse>(`${environment.apiUrl}/countries`).pipe(
      map((response) => ({ configs: this.mapToConfigs(response.data), fromNetwork: true })),
      catchError((err) => {
        console.error('[CountryService] Error cargando países, usando fallback PR:', err);
        return of({ configs: FALLBACK_COUNTRIES, fromNetwork: false });
      }),
      tap(({ configs, fromNetwork }) => {
        if (fromNetwork) this.saveCache(configs);
        this.applyConfigs(configs);
      }),
      map(() => void 0),
    );
  }

  // ==================== MÉTODOS PÚBLICOS ====================

  getCurrentCountry(): string {
    return this.currentCountrySubject.value;
  }

  getCurrentConfig(): CountryConfig {
    return this.countryConfigs[this.getCurrentCountry()] ?? FALLBACK_COUNTRIES[0];
  }

  setCountry(country: string): void {
    if (!this.countryConfigs[country]) {
      console.error(`[CountryService] País no soportado: ${country}`);
      return;
    }
    const config = this.countryConfigs[country];
    localStorage.setItem('selectedCountry', country);
    this.currentCountrySubject.next(country);
    this.translocoService.setActiveLang(config.locale);
    this.currentLanguageSubject.next(config.locale);
    localStorage.setItem('app-language', config.locale);
  }

  getLocaleForLanguage(baseLanguage: 'es' | 'en'): string {
    if (baseLanguage === 'en') return 'en';
    const currentCountry = this.getCurrentCountry();
    return this.countryConfigs[currentCountry]?.locale ?? DEFAULT_LANGUAGE;
  }

  getAvailableCountries(): CountryConfig[] {
    return Object.values(this.countryConfigs);
  }

  getCountryConfig(code: string): CountryConfig | undefined {
    return this.countryConfigs[code];
  }

  setLanguage(language: string): void {
    if (!this.isValidLanguage(language)) {
      console.error(`[CountryService] Idioma no soportado: ${language}`);
      return;
    }
    localStorage.setItem('app-language', language);
    this.currentLanguageSubject.next(language);
    this.translocoService.setActiveLang(language);
  }

  setBaseLanguage(baseLanguage: BaseLanguage): void {
    const newLocale = this.getLocaleForLanguage(baseLanguage);
    this.setLanguage(newLocale);
  }

  get currentLanguage(): string {
    return this.currentLanguageSubject.value;
  }

  get baseLanguage(): BaseLanguage {
    return this.getBaseLanguage(this.currentLanguage);
  }

  isBaseLanguageActive(language: BaseLanguage): boolean {
    return this.getBaseLanguage(this.currentLanguage) === language;
  }

  switchLanguage(): void {
    const newBase: BaseLanguage = this.baseLanguage === 'es' ? 'en' : 'es';
    this.setBaseLanguage(newBase);
  }

  getAvailableLanguages(): Array<{ code: BaseLanguage; name: string; flag: string }> {
    return [
      { code: 'es', name: 'Español', flag: 'es' },
      { code: 'en', name: 'English', flag: 'gb' },
    ];
  }

  get stateLabel(): string {
    return this.getCurrentCountry() === 'CO' ? 'Departamento' : 'Estado';
  }

  get healthInsuranceLabel(): string {
    switch (this.getCurrentCountry()) {
      case 'CO':
        return 'EPS';
      case 'PR':
        return 'Plan Médico';
      case 'US':
        return 'Health Insurance';
      default:
        return 'EPS';
    }
  }

  getCountryTerm(baseKey: string): string {
    const countrySpecificKey = `${baseKey}.${this.getCurrentCountry()}`;
    const translation = this.translocoService.translate(countrySpecificKey);
    return translation === countrySpecificKey ? this.translocoService.translate(baseKey) : translation;
  }

  // ==================== MÉTODOS ADMIN (CRUD backend) ====================

  getCountries(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/countries`);
  }

  createCountry(country: { name: string; code: string }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/countries`, country);
  }

  updateCountry(id: number, country: { name: string; code: string }): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/countries/${id}`, country);
  }

  // ==================== MÉTODOS PRIVADOS ====================

  private applyConfigs(configs: CountryConfig[]): void {
    this.buildConfigs(configs);
    this.initializeLanguage();
    this.loadSavedCountry();
  }

  private buildConfigs(configs: CountryConfig[]): void {
    // Guarda TODOS los paises validos (con `code`) en countryConfigs para que el
    // selector de "Pais de residencia" en formularios los muestre, aun si no
    // tienen `locale` configurado en el backend.
    const validForUi = configs.filter((c) => !!c?.code);

    this.countryConfigs = validForUi.reduce(
      (acc, c) => {
        acc[c.code] = c;
        return acc;
      },
      {} as Record<string, CountryConfig>,
    );

    // Para Transloco solo registramos paises que ademas tengan un `locale` valido,
    // evitando peticiones a /assets/i18n/null.json.
    const langs = validForUi
      .filter((c) => typeof c.locale === 'string' && c.locale.trim().length > 0)
      .map((c) => ({ id: c.locale, label: c.name }));
    if (langs.length > 0) {
      this.translocoService.setAvailableLangs(langs);
    }
  }

  private mapToConfigs(countries: BackendCountry[]): CountryConfig[] {
    // Devuelve todos los paises activos, incluso los que no tienen `locale`.
    // El filtrado para Transloco se hace luego en buildConfigs().
    return countries
      .filter((c) => c.isActive)
      .map((c) => ({
        id: c.id,
        code: c.iso,
        name: c.name,
        locale: this.normalizeLocale(c.locale),
        currency: c.currency,
        phonePrefix: c.phonePrefix,
        flag: c.flagUrl,
      }));
  }

  private normalizeLocale(locale: string): string {
    if (!locale) return locale;
    return LOCALE_NORMALIZATION[locale] ?? locale;
  }

  private initializeLanguage(): void {
    const saved = localStorage.getItem('app-language');
    // Considera invalidos: null, "", "null", "undefined" o cualquier valor no soportado
    const isUsable =
      typeof saved === 'string' &&
      saved.trim() !== '' &&
      saved !== 'null' &&
      saved !== 'undefined' &&
      this.isValidLanguage(saved);
    const lang = isUsable ? (saved as string) : DEFAULT_LANGUAGE;
    this.translocoService.setActiveLang(lang);
    this.currentLanguageSubject.next(lang);
    // Persistir siempre el idioma resuelto para que no quede null en localStorage
    try {
      localStorage.setItem('app-language', lang);
    } catch {
      // localStorage no disponible (modo privado, etc.) — ignorar
    }
  }

  private loadSavedCountry(): void {
    const saved = localStorage.getItem('selectedCountry');
    if (saved && this.countryConfigs[saved]) {
      this.currentCountrySubject.next(saved);
      return;
    }
    // Si no hay pais guardado, persistir el actual (default 'PR') para evitar null en localStorage
    const current = this.currentCountrySubject.value;
    if (this.countryConfigs[current]) {
      try {
        localStorage.setItem('selectedCountry', current);
      } catch {
        // ignorar
      }
    }
  }

  private isValidLanguage(lang: string): boolean {
    return Object.values(this.countryConfigs).some((c) => c.locale === lang);
  }

  private getBaseLanguage(locale: string): BaseLanguage {
    return locale.startsWith('es') ? 'es' : 'en';
  }

  private getCache(): CountryConfig[] | null {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const cache: CountriesCache = JSON.parse(raw);
      const age = Date.now() - new Date(cache.cachedAt).getTime();
      if (age >= CACHE_TTL_MS) return null;
      // Invalidar caché si los países no tienen id (guardada con versión anterior)
      if (cache.data.some((c) => c.id == null)) {
        localStorage.removeItem(CACHE_KEY);
        return null;
      }
      return cache.data;
    } catch {
      return null;
    }
  }

  private saveCache(data: CountryConfig[]): void {
    try {
      const cache: CountriesCache = { data, cachedAt: new Date().toISOString() };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch {
      // localStorage podría no estar disponible
    }
  }
}
