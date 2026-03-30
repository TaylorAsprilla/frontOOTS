import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslocoService } from '@ngneat/transloco';

/**
 * Pipe that formats dates according to the active locale:
 *   es-CO  → Colombian/Latin format  (dd/MM/yyyy)
 *   es-PR  → US format               (MM/dd/yyyy)
 *   en     → US format               (MM/dd/yyyy)
 *
 * Usage: {{ value | localizedDate }} or {{ value | localizedDate : 'short' }}
 */
@Pipe({
  name: 'localizedDate',
  standalone: true,
  pure: false, // re-evaluates on language change
})
export class LocalizedDatePipe implements PipeTransform {
  constructor(private readonly translocoSvc: TranslocoService) {}

  transform(value: string | Date | number | null | undefined, format?: string): string | null {
    if (value == null) return null;

    const lang = this.translocoSvc.getActiveLang();
    const locale = this.mapLocale(lang);
    const fmt = this.mapFormat(format, lang);

    return new DatePipe(locale).transform(value, fmt) ?? null;
  }

  private mapLocale(lang: string): string {
    switch (lang) {
      case 'en':
        return 'en-US';
      case 'es-PR':
        return 'es-PR';
      default:
        return 'es-CO';
    }
  }

  /**
   * Maps a format string to the locale-appropriate equivalent.
   * Format strings that contain explicit day/month order are remapped;
   * Angular's built-in named formats ('short', 'medium', etc.) are left
   * as-is because Angular applies locale-aware ordering automatically.
   */
  private mapFormat(format: string | undefined, lang: string): string {
    const isUS = lang === 'en' || lang === 'es-PR';

    switch (format) {
      case 'dd/MM/yyyy':
        return isUS ? 'MM/dd/yyyy' : 'dd/MM/yyyy';
      case 'dd/MM/yyyy, HH:mm':
        return isUS ? 'MM/dd/yyyy, HH:mm' : 'dd/MM/yyyy, HH:mm';
      case 'MMM dd, y':
        return isUS ? 'MMM d, y' : 'd MMM y';
      case 'dd MMM yyyy':
        return isUS ? 'MMM d, y' : 'dd MMM yyyy';
      // 'short', 'medium', 'long', 'MMMM - yyyy', 'HH:mm', 'yyyy' → locale-handled
      default:
        return format ?? (isUS ? 'M/d/yyyy' : 'dd/MM/yyyy');
    }
  }
}
