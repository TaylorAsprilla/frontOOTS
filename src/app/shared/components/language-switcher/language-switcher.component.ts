import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { LanguageService, SupportedLanguage } from '../../../core/services/language.service';

/**
 * Componente standalone para cambio de idioma con banderas
 */
@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss'],
})
export class LanguageSwitcherComponent {
  protected readonly languageService = inject(LanguageService);

  /**
   * Cambia al idioma especificado
   */
  protected switchToLanguage(language: SupportedLanguage): void {
    this.languageService.setLanguage(language);
  }

  /**
   * Alterna entre idiomas (útil para métodos adicionales)
   */
  protected toggleLanguage(): void {
    this.languageService.switchLanguage();
  }
}
