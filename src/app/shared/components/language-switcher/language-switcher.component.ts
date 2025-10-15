import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { LanguageService, SupportedLanguage } from '../../../core/services/language.service';

/**
 * Componente standalone para cambio de idioma
 */
@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  template: `
    <div class="language-switcher" [attr.aria-label]="'navigation.language_switcher' | transloco">
      <div class="language-options">
        <button
          *ngFor="let lang of availableLanguages"
          type="button"
          class="language-btn"
          [class.active]="languageService.isLanguageActive(lang.code)"
          [attr.aria-label]="'navigation.switch_to' | transloco : { language: lang.name }"
          [attr.aria-pressed]="languageService.isLanguageActive(lang.code)"
          (click)="switchToLanguage(lang.code)"
          [title]="lang.name"
        >
          <span class="flag" [attr.aria-hidden]="true">{{ lang.flag }}</span>
          <span class="language-name">{{ lang.name }}</span>
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .language-switcher {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .language-options {
        display: flex;
        gap: 0.25rem;
        border-radius: 0.5rem;
        background-color: var(--bs-gray-100, #f8f9fa);
        padding: 0.25rem;
      }

      .language-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 0.75rem;
        border: none;
        border-radius: 0.375rem;
        background-color: transparent;
        color: var(--bs-gray-700, #495057);
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        white-space: nowrap;
      }

      .language-btn:hover {
        background-color: var(--bs-gray-200, #e9ecef);
        color: var(--bs-gray-800, #343a40);
      }

      .language-btn:focus {
        outline: 2px solid var(--bs-primary, #0d6efd);
        outline-offset: 2px;
      }

      .language-btn.active {
        background-color: var(--bs-primary, #0d6efd);
        color: white;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
      }

      .language-btn.active:hover {
        background-color: var(--bs-primary-dark, #0b5ed7);
      }

      .flag {
        font-size: 1.125rem;
        line-height: 1;
      }

      .language-name {
        font-size: 0.875rem;
        font-weight: 500;
      }

      /* Modo compacto para espacios pequeños */
      .language-switcher.compact .language-name {
        display: none;
      }

      .language-switcher.compact .language-btn {
        padding: 0.375rem;
        min-width: 2.5rem;
        justify-content: center;
      }

      /* Responsive */
      @media (max-width: 576px) {
        .language-name {
          display: none;
        }

        .language-btn {
          padding: 0.375rem;
          min-width: 2.5rem;
          justify-content: center;
        }
      }

      /* Dark mode support */
      @media (prefers-color-scheme: dark) {
        .language-options {
          background-color: var(--bs-gray-800, #343a40);
        }

        .language-btn {
          color: var(--bs-gray-300, #dee2e6);
        }

        .language-btn:hover {
          background-color: var(--bs-gray-700, #495057);
          color: var(--bs-gray-100, #f8f9fa);
        }
      }

      /* Modo vertical para sidebars */
      .language-switcher.vertical .language-options {
        flex-direction: column;
        width: 100%;
      }

      .language-switcher.vertical .language-btn {
        justify-content: flex-start;
        width: 100%;
      }
    `,
  ],
})
export class LanguageSwitcherComponent {
  protected readonly languageService = inject(LanguageService);

  protected readonly availableLanguages = this.languageService.getAvailableLanguages();

  /**
   * Cambia al idioma seleccionado
   */
  protected switchToLanguage(language: SupportedLanguage): void {
    this.languageService.setLanguage(language);
  }

  /**
   * Alterna entre idiomas (útil para botón único)
   */
  protected toggleLanguage(): void {
    this.languageService.switchLanguage();
  }
}
