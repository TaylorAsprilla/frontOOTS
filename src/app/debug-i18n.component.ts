import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoService, TranslocoModule } from '@ngneat/transloco';
import { CountryService } from './core/services/country.service';

/**
 * Componente de diagnóstico para verificar el estado de las traducciones
 */
@Component({
  selector: 'app-i18n-debug',
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  template: `
    <div class="container mt-4">
      <div class="card">
        <div class="card-header">
          <h4>Diagnóstico de Internacionalización</h4>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <h5>Estado de Transloco:</h5>
              <ul class="list-group list-group-flush">
                <li class="list-group-item"><strong>Idioma activo:</strong> {{ activeLanguage }}</li>
                <li class="list-group-item">
                  <strong>Idiomas disponibles:</strong> {{ availableLanguages.join(', ') }}
                </li>
                <li class="list-group-item">
                  <strong>Estado de carga:</strong>
                  <span [class]="isLoaded ? 'text-success' : 'text-warning'">
                    {{ isLoaded ? 'Cargado' : 'Cargando...' }}
                  </span>
                </li>
                <li class="list-group-item"><strong>Traducciones cargadas:</strong> {{ translationsLoaded }}</li>
              </ul>
            </div>
            <div class="col-md-6">
              <h5>Pruebas de Traducción:</h5>
              <ul class="list-group list-group-flush">
                <li class="list-group-item"><strong>app.title:</strong> {{ 'app.title' | transloco }}</li>
                <li class="list-group-item"><strong>app.welcome:</strong> {{ 'app.welcome' | transloco }}</li>
                <li class="list-group-item">
                  <strong>navigation.dashboard:</strong> {{ 'navigation.dashboard' | transloco }}
                </li>
                <li class="list-group-item"><strong>buttons.save:</strong> {{ 'buttons.save' | transloco }}</li>
              </ul>
            </div>
          </div>

          <div class="mt-4">
            <h5>Acciones de prueba:</h5>
            <button class="btn btn-primary me-2" (click)="changeToSpanish()">Cambiar a Español</button>
            <button class="btn btn-secondary me-2" (click)="changeToEnglish()">Cambiar a Inglés</button>
            <button class="btn btn-info" (click)="reloadTranslations()">Recargar Traducciones</button>
          </div>

          <div class="mt-4" *ngIf="debugInfo">
            <h5>Información de depuración:</h5>
            <pre class="bg-light p-3">{{ debugInfo | json }}</pre>
          </div>

          <div class="mt-4" *ngIf="errorInfo">
            <h5 class="text-danger">Errores:</h5>
            <div class="alert alert-danger">{{ errorInfo }}</div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class I18nDebugComponent implements OnInit {
  private transloco = inject(TranslocoService);
  private countryService = inject(CountryService);

  activeLanguage = '';
  availableLanguages: string[] = [];
  isLoaded = false;
  translationsLoaded = '';
  debugInfo: any = null;
  errorInfo = '';

  ngOnInit() {
    this.checkTranslocoStatus();
    this.setupSubscriptions();
  }

  private checkTranslocoStatus() {
    try {
      // Obtener idioma activo
      this.activeLanguage = this.transloco.getActiveLang();

      // Obtener idiomas disponibles
      this.availableLanguages = this.transloco.getAvailableLangs() as string[];

      // Verificar si las traducciones están cargadas
      this.transloco.langChanges$.subscribe((lang) => {
        this.activeLanguage = lang;
        this.checkTranslationsLoaded();
      });

      this.checkTranslationsLoaded();
    } catch (error) {
      this.errorInfo = `Error al verificar estado de Transloco: ${error}`;
      console.error('Error en checkTranslocoStatus:', error);
    }
  }

  private checkTranslationsLoaded() {
    try {
      const currentTranslations = this.transloco.getTranslation(this.activeLanguage);
      this.isLoaded = !!currentTranslations && Object.keys(currentTranslations).length > 0;
      this.translationsLoaded = this.isLoaded ? `${Object.keys(currentTranslations).length} claves` : 'No cargadas';

      this.debugInfo = {
        activeLanguage: this.activeLanguage,
        availableLanguages: this.availableLanguages,
        isLoaded: this.isLoaded,
        translationKeys: this.isLoaded ? Object.keys(currentTranslations) : [],
        sampleTranslations: this.isLoaded
          ? {
              'app.title': currentTranslations['app']?.['title'],
              'app.welcome': currentTranslations['app']?.['welcome'],
              'navigation.dashboard': currentTranslations['navigation']?.['dashboard'],
            }
          : {},
      };
    } catch (error) {
      this.errorInfo = `Error al verificar traducciones: ${error}`;
      console.error('Error en checkTranslationsLoaded:', error);
    }
  }

  private setupSubscriptions() {
    // Suscribirse a cambios del CountryService
    this.countryService.currentLanguage$.subscribe((lang) => {
      this.activeLanguage = lang;
      this.checkTranslationsLoaded();
    });
  }

  changeToSpanish() {
    this.countryService.setBaseLanguage('es');
  }

  changeToEnglish() {
    this.countryService.setBaseLanguage('en');
  }

  reloadTranslations() {
    try {
      this.transloco.load(this.activeLanguage).subscribe({
        next: (translations) => {
          this.checkTranslationsLoaded();
        },
        error: (error) => {
          this.errorInfo = `Error al recargar traducciones: ${error}`;
          console.error('Error al recargar:', error);
        },
      });
    } catch (error) {
      this.errorInfo = `Error en reloadTranslations: ${error}`;
      console.error('Error en reloadTranslations:', error);
    }
  }
}
