import { Injectable, inject } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { BehaviorSubject, Observable } from 'rxjs';
import { CountryService } from './country.service';

export type SupportedLanguage = 'es-CO' | 'es-PR' | 'en';
export type BaseLanguage = 'es' | 'en';

/**
 * Servicio para gestionar el cambio de idioma en la aplicación
 */
@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly transloco = inject(TranslocoService);
  private readonly STORAGE_KEY = 'app-language';
  private readonly DEFAULT_LANGUAGE: SupportedLanguage = 'es-CO';
  private countryService?: CountryService;

  // Observable para el idioma actual
  private currentLanguageSubject = new BehaviorSubject<SupportedLanguage>(this.DEFAULT_LANGUAGE);
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  constructor() {
    // Esperar a que Transloco esté listo antes de inicializar
    this.transloco.events$.subscribe((event) => {
      if (event.type === 'translationLoadSuccess') {
      }
      if (event.type === 'translationLoadFailure') {
        console.error('Error cargando traducciones para:', event.payload.langName);
      }
    });

    // Inicializar después de un pequeño delay para permitir que Transloco se configure
    setTimeout(() => {
      this.initializeLanguage();
      // Inyectar CountryService después de la inicialización para evitar dependencia circular
      this.countryService = inject(CountryService);
    }, 100);
  }

  /**
   * Inicializa el idioma desde localStorage o usa el por defecto
   */
  private initializeLanguage(): void {
    const savedLanguage = this.getSavedLanguage();
    const browserLanguage = this.getBrowserLanguage();

    // Prioridad: localStorage > browser > default
    const initialLanguage = savedLanguage || browserLanguage || this.DEFAULT_LANGUAGE;

    // Configurar el idioma inicial directamente
    this.transloco.setActiveLang(initialLanguage);
    this.currentLanguageSubject.next(initialLanguage);
    this.saveLanguage(initialLanguage);
  }
  /**
   * Obtiene el idioma guardado en localStorage
   */
  private getSavedLanguage(): SupportedLanguage | null {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY) as SupportedLanguage;
      return this.isValidLanguage(saved) ? saved : null;
    } catch (error) {
      console.warn('Could not access localStorage for language preference:', error);
      return null;
    }
  }

  /**
   * Obtiene el idioma del navegador
   */
  private getBrowserLanguage(): SupportedLanguage | null {
    try {
      const browserLang = navigator.language?.split('-')[0] as SupportedLanguage;
      return this.isValidLanguage(browserLang) ? browserLang : null;
    } catch (error) {
      console.warn('Could not detect browser language:', error);
      return null;
    }
  }

  /**
   * Valida si un idioma es soportado
   */
  private isValidLanguage(lang: string): lang is SupportedLanguage {
    return lang === 'es-CO' || lang === 'es-PR' || lang === 'en';
  }

  /**
   * Obtiene el idioma base (sin país) de un locale
   */
  private getBaseLanguage(locale: SupportedLanguage): BaseLanguage {
    return locale.startsWith('es') ? 'es' : 'en';
  }

  /**
   * Obtiene el código de país de un locale
   */
  getCountryFromLocale(locale: SupportedLanguage): string {
    if (locale === 'es-CO') return 'CO';
    if (locale === 'es-PR') return 'PR';
    return '';
  }

  /**
   * Guarda el idioma en localStorage
   */
  private saveLanguage(language: SupportedLanguage): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, language);
    } catch (error) {
      console.warn('Could not save language preference to localStorage:', error);
    }
  }

  /**
   * Obtiene el idioma actual
   */
  get currentLanguage(): SupportedLanguage {
    return this.currentLanguageSubject.value;
  }

  /**
   * Cambia el idioma de la aplicación
   */
  setLanguage(language: SupportedLanguage): void {
    if (!this.isValidLanguage(language)) {
      language = this.DEFAULT_LANGUAGE;
    }

    // Cargar las traducciones primero, luego cambiar el idioma
    this.transloco.load(language).subscribe({
      next: (translations) => {
        // Cambiar idioma en Transloco
        this.transloco.setActiveLang(language);

        // Guardar en localStorage
        this.saveLanguage(language);

        // Actualizar observable
        this.currentLanguageSubject.next(language);
      },
      error: (error) => {
        // Intentar cambiar de todos modos
        this.transloco.setActiveLang(language);
        this.saveLanguage(language);
        this.currentLanguageSubject.next(language);
      },
    });
  }

  /**
   * Cambia entre español e inglés manteniendo el país
   */
  switchLanguage(): void {
    const currentBase = this.getBaseLanguage(this.currentLanguage);
    let newLanguage: SupportedLanguage;

    if (currentBase === 'es') {
      // Cambiar a inglés
      newLanguage = 'en';
    } else {
      // Cambiar a español, mantener el país si había uno
      const country = this.getCountryFromLocale(this.currentLanguage);
      newLanguage = country ? (`es-${country}` as SupportedLanguage) : 'es-CO';
    }

    this.setLanguage(newLanguage);
  }

  /**
   * Cambia el idioma base manteniendo el país actual (para español)
   */
  setBaseLanguage(baseLanguage: BaseLanguage): void {
    let newLanguage: SupportedLanguage;

    if (baseLanguage === 'en') {
      newLanguage = 'en';
    } else {
      // Usar CountryService para obtener el locale correcto según el país actual
      if (this.countryService) {
        newLanguage = this.countryService.getLocaleForLanguage('es') as SupportedLanguage;
      } else {
        // Fallback si CountryService no está disponible
        const currentCountry = this.getCountryFromLocale(this.currentLanguage);
        newLanguage = currentCountry ? (`es-${currentCountry}` as SupportedLanguage) : 'es-CO';
      }
    }

    this.setLanguage(newLanguage);
  }

  /**
   * Obtiene el nombre del idioma en el idioma actual
   */
  getLanguageName(language: SupportedLanguage): string {
    // Por ahora retornamos nombres fijos, pero podríamos usar traducciones
    if (language === 'en') return 'English';
    return 'Español'; // es-CO o es-PR
  }

  /**
   * Obtiene las opciones de idioma base disponibles
   */
  getAvailableLanguages(): Array<{ code: BaseLanguage; name: string; flag: string }> {
    return [
      { code: 'es', name: 'Español', flag: 'es' },
      { code: 'en', name: 'English', flag: 'gb' },
    ];
  }

  /**
   * Obtiene el idioma base actual (sin país)
   */
  get baseLanguage(): BaseLanguage {
    return this.getBaseLanguage(this.currentLanguage);
  }

  /**
   * Verifica si un idioma está activo
   */
  isLanguageActive(language: SupportedLanguage): boolean {
    return this.currentLanguage === language;
  }

  /**
   * Verifica si un idioma base está activo
   */
  isBaseLanguageActive(language: BaseLanguage): boolean {
    return this.getBaseLanguage(this.currentLanguage) === language;
  }

  /**
   * Método de utilidad para obtener traducción directa
   */
  translate(key: string, params?: any): Observable<string> {
    return this.transloco.selectTranslate(key, params);
  }

  /**
   * Método de utilidad para obtener traducción inmediata (síncrona)
   */
  translateInstant(key: string, params?: any): string {
    return this.transloco.translate(key, params);
  }
}
