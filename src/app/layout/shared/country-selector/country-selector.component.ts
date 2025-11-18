import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { CountryService, CountryCode, CountryConfig } from 'src/app/core/services/country.service';

@Component({
  selector: 'app-country-selector',
  standalone: true,
  imports: [CommonModule, NgbDropdownModule],
  templateUrl: './country-selector.component.html',
  styleUrls: ['./country-selector.component.scss'],
})
export class CountrySelectorComponent implements OnInit {
  availableCountries: CountryConfig[] = [];
  currentCountry: CountryConfig | undefined;

  constructor(private countryService: CountryService) {}

  ngOnInit(): void {
    this.availableCountries = this.countryService.getAvailableCountries();
    this.updateCurrentCountry();

    // Suscribirse a cambios de país
    this.countryService.currentCountry$.subscribe(() => {
      this.updateCurrentCountry();
    });
  }

  /**
   * Cambiar país seleccionado
   */
  selectCountry(countryCode: CountryCode): void {
    this.countryService.setCountry(countryCode);
  }

  /**
   * Actualizar configuración del país actual
   */
  private updateCurrentCountry(): void {
    this.currentCountry = this.countryService.getCurrentConfig();
  }
}
