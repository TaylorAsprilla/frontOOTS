import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';

/**
 * Países soportados por el sistema
 */
export type CountryCode = 'CO' | 'PR' | 'US';

/**
 * Idiomas soportados (con locales)
 */
export type SupportedLanguage = 'es-CO' | 'es-PR' | 'en';
export type BaseLanguage = 'es' | 'en';

/**
 * Configuración por país
 */
export interface CountryConfig {
  code: CountryCode;
  name: string;
  locale: string; // es-CO, es-PR
  currency: string;
  phonePrefix: string;
  flag: string; // emoji o ruta a imagen
}

/**
 * Servicio para gestionar la configuración específica por país
 */
@Injectable({
  providedIn: 'root',
})
export class CountryService {
  /**
   * Configuraciones disponibles por país
   */
  private readonly countryConfigs: Record<CountryCode, CountryConfig> = {
    CO: {
      code: 'CO',
      name: 'Colombia',
      locale: 'es-CO',
      currency: 'COP',
      phonePrefix: '+57',
      flag: 'https://flagcdn.com/w20/co.png',
    },
    PR: {
      code: 'PR',
      name: 'Puerto Rico',
      locale: 'es-PR',
      currency: 'USD',
      phonePrefix: '+1',
      flag: 'https://flagcdn.com/w20/pr.png',
    },
    US: {
      code: 'US',
      name: 'United States',
      locale: 'en',
      currency: 'USD',
      phonePrefix: '+1',
      flag: 'https://flagcdn.com/w20/us.png',
    },
  };

  /**
   * País actual seleccionado (por defecto Colombia)
   */
  private currentCountrySubject = new BehaviorSubject<CountryCode>('CO');
  public currentCountry$: Observable<CountryCode> = this.currentCountrySubject.asObservable();

  /**
   * Idioma actual (observable)
   */
  private currentLanguageSubject = new BehaviorSubject<SupportedLanguage>('es-CO');
  public currentLanguage$: Observable<SupportedLanguage> = this.currentLanguageSubject.asObservable();

  constructor(private translocoService: TranslocoService) {
    this.initializeLanguage();
    this.loadSavedCountry();
  }

  /**
   * Obtener país actual
   */
  getCurrentCountry(): CountryCode {
    return this.currentCountrySubject.value;
  }

  /**
   * Obtener configuración del país actual
   */
  getCurrentConfig(): CountryConfig {
    return this.countryConfigs[this.getCurrentCountry()];
  }

  /**
   * Cambiar país actual
   * @param country Código del país
   */
  setCountry(country: CountryCode): void {
    if (!this.countryConfigs[country]) {
      console.error(`País no soportado: ${country}`);
      return;
    }

    const config = this.countryConfigs[country];

    // Guardar en localStorage
    localStorage.setItem('selectedCountry', country);

    // Actualizar observable
    this.currentCountrySubject.next(country);

    // Cambiar locale en Transloco
    // USA siempre usa inglés, otros países usan su locale específico
    const newLocale = config.locale;
    this.translocoService.setActiveLang(newLocale);
    this.currentLanguageSubject.next(newLocale as SupportedLanguage);
    localStorage.setItem('app-language', newLocale);
  }

  /**
   * Obtener el locale correcto según el país y idioma base actual
   * @param baseLanguage 'es' o 'en'
   * @returns Locale completo como 'es-CO', 'es-PR' o 'en'
   */
  getLocaleForLanguage(baseLanguage: 'es' | 'en'): string {
    if (baseLanguage === 'en') {
      return 'en';
    }
    const currentCountry = this.getCurrentCountry();
    return this.countryConfigs[currentCountry].locale;
  }

  /**
   * Obtener todas las configuraciones de países disponibles
   */
  getAvailableCountries(): CountryConfig[] {
    return Object.values(this.countryConfigs);
  }

  /**
   * Obtener configuración de un país específico
   */
  getCountryConfig(code: CountryCode): CountryConfig | undefined {
    return this.countryConfigs[code];
  }

  /**
   * Cargar país guardado del localStorage al iniciar
   */
  private loadSavedCountry(): void {
    const saved = localStorage.getItem('selectedCountry') as CountryCode;
    if (saved && this.countryConfigs[saved]) {
      this.setCountry(saved);
    }
  }

  /**
   * Inicializar idioma desde localStorage o navegador
   */
  private initializeLanguage(): void {
    const savedLanguage = localStorage.getItem('app-language') as SupportedLanguage;

    if (savedLanguage && this.isValidLanguage(savedLanguage)) {
      this.translocoService.setActiveLang(savedLanguage);
      this.currentLanguageSubject.next(savedLanguage);
    } else {
      // Usar idioma por defecto
      this.translocoService.setActiveLang('es-CO');
      this.currentLanguageSubject.next('es-CO');
    }
  }

  /**
   * Validar si un idioma es soportado
   */
  private isValidLanguage(lang: string): lang is SupportedLanguage {
    return lang === 'es-CO' || lang === 'es-PR' || lang === 'en';
  }

  /**
   * Obtener idioma base del locale
   */
  private getBaseLanguage(locale: SupportedLanguage): BaseLanguage {
    return locale.startsWith('es') ? 'es' : 'en';
  }

  /**
   * Cambiar idioma base (es/en) manteniendo país actual
   */
  setBaseLanguage(baseLanguage: BaseLanguage): void {
    const newLocale = this.getLocaleForLanguage(baseLanguage);
    this.setLanguage(newLocale as SupportedLanguage);
  }

  /**
   * Cambiar idioma completo
   */
  setLanguage(language: SupportedLanguage): void {
    if (!this.isValidLanguage(language)) {
      console.error(`Idioma no soportado: ${language}`);
      return;
    }

    // Guardar en localStorage
    localStorage.setItem('app-language', language);

    // Actualizar observable
    this.currentLanguageSubject.next(language);

    // Cambiar en Transloco
    this.translocoService.setActiveLang(language);
  }

  /**
   * Obtener idioma actual
   */
  get currentLanguage(): SupportedLanguage {
    return this.currentLanguageSubject.value;
  }

  /**
   * Obtener idioma base actual
   */
  get baseLanguage(): BaseLanguage {
    return this.getBaseLanguage(this.currentLanguage);
  }

  /**
   * Verificar si un idioma base está activo
   */
  isBaseLanguageActive(language: BaseLanguage): boolean {
    return this.getBaseLanguage(this.currentLanguage) === language;
  }

  /**
   * Alternar entre español e inglés
   */
  switchLanguage(): void {
    const currentBase = this.getBaseLanguage(this.currentLanguage);
    const newBase: BaseLanguage = currentBase === 'es' ? 'en' : 'es';
    this.setBaseLanguage(newBase);
  }

  /**
   * Obtener opciones de idioma base disponibles
   */
  getAvailableLanguages(): Array<{ code: BaseLanguage; name: string; flag: string }> {
    return [
      { code: 'es', name: 'Español', flag: 'es' },
      { code: 'en', name: 'English', flag: 'gb' },
    ];
  }

  /**
   * Obtener label para campo de estado/departamento según país
   */
  get stateLabel(): string {
    const country = this.getCurrentCountry();
    return country === 'CO' ? 'Departamento' : 'Estado';
  }

  /**
   * Obtener label para campo de seguro médico según país
   */
  get healthInsuranceLabel(): string {
    const country = this.getCurrentCountry();
    switch (country) {
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

  /**
   * Obtener traducción específica por país
   * Útil para términos que varían por país
   */
  getCountryTerm(baseKey: string): string {
    const country = this.getCurrentCountry();
    const countrySpecificKey = `${baseKey}.${country}`;

    // Intentar obtener traducción específica del país
    const translation = this.translocoService.translate(countrySpecificKey);

    // Si no existe, usar la traducción base
    if (translation === countrySpecificKey) {
      return this.translocoService.translate(baseKey);
    }

    return translation;
  }
}
