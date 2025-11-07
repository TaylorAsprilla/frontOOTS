import { Injectable, inject } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { BehaviorSubject, Observable } from 'rxjs';

export type SupportedLanguage = 'es' | 'en';

/**
 * Servicio para gestionar el cambio de idioma en la aplicación
 */
@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly transloco = inject(TranslocoService);
  private readonly STORAGE_KEY = 'app-language';
  private readonly DEFAULT_LANGUAGE: SupportedLanguage = 'es';

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
    return lang === 'es' || lang === 'en';
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
   * Cambia entre español e inglés
   */
  switchLanguage(): void {
    const newLanguage: SupportedLanguage = this.currentLanguage === 'es' ? 'en' : 'es';
    this.setLanguage(newLanguage);
  }

  /**
   * Obtiene el nombre del idioma en el idioma actual
   */
  getLanguageName(language: SupportedLanguage): string {
    // Por ahora retornamos nombres fijos, pero podríamos usar traducciones
    return language === 'es' ? 'Español' : 'English';
  }

  /**
   * Obtiene las opciones de idioma disponibles
   */
  getAvailableLanguages(): Array<{ code: SupportedLanguage; name: string; flag: string }> {
    return [
      { code: 'es', name: 'Español', flag: 'es' },
      { code: 'en', name: 'English', flag: 'gb' },
    ];
  }

  /**
   * Verifica si un idioma está activo
   */
  isLanguageActive(language: SupportedLanguage): boolean {
    return this.currentLanguage === language;
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
