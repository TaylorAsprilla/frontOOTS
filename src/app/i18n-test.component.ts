import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { LanguageService } from './core/services/language.service';
import { LanguageSwitcherComponent } from './shared/components/language-switcher/language-switcher.component';

/**
 * Componente de prueba para verificar que las traducciones funcionan
 */
@Component({
  selector: 'app-i18n-test',
  standalone: true,
  imports: [CommonModule, TranslocoModule, LanguageSwitcherComponent],
  template: `
    <div class="container mt-4">
      <div class="card">
        <div class="card-header">
          <h4>{{ 'app.title' | transloco }}</h4>
          <app-language-switcher></app-language-switcher>
        </div>
        <div class="card-body">
          <h5>{{ 'navigation.welcome' | transloco }}</h5>
          <p>{{ 'app.welcome' | transloco }}</p>

          <div class="row">
            <div class="col-md-6">
              <h6>Navegación:</h6>
              <ul>
                <li>{{ 'navigation.dashboard' | transloco }}</li>
                <li>{{ 'navigation.users' | transloco }}</li>
                <li>{{ 'navigation.settings' | transloco }}</li>
                <li>{{ 'navigation.profile' | transloco }}</li>
              </ul>
            </div>
            <div class="col-md-6">
              <h6>Botones:</h6>
              <ul>
                <li>{{ 'buttons.save' | transloco }}</li>
                <li>{{ 'buttons.cancel' | transloco }}</li>
                <li>{{ 'buttons.edit' | transloco }}</li>
                <li>{{ 'buttons.delete' | transloco }}</li>
              </ul>
            </div>
          </div>

          <div class="mt-3">
            <h6>Estado actual:</h6>
            <p><strong>Idioma activo:</strong> {{ languageService.currentLanguage }}</p>
            <p><strong>Idiomas disponibles:</strong> {{ availableLanguages }}</p>
          </div>

          <div class="mt-3">
            <button class="btn btn-primary me-2" (click)="setSpanish()">Cambiar a Español</button>
            <button class="btn btn-secondary" (click)="setEnglish()">Switch to English</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class I18nTestComponent {
  public languageService = inject(LanguageService);

  get availableLanguages(): string {
    return this.languageService
      .getAvailableLanguages()
      .map((lang: any) => lang.name)
      .join(', ');
  }

  setSpanish() {
    this.languageService.setLanguage('es');
  }

  setEnglish() {
    this.languageService.setLanguage('en');
  }
}
