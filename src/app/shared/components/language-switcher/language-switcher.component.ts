import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { CountryService, BaseLanguage } from '../../../core/services/country.service';

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
  protected readonly countryService = inject(CountryService);

  /**
   * Cambia al idioma base especificado (mantiene el país actual)
   */
  protected switchToLanguage(language: BaseLanguage): void {
    this.countryService.setBaseLanguage(language);
  }

  /**
   * Alterna entre idiomas (útil para métodos adicionales)
   */
  protected toggleLanguage(): void {
    this.countryService.switchLanguage();
  }
}
