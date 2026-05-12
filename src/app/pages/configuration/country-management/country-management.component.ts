import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryService } from 'src/app/core/services/country.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

interface Country {
  id?: number;
  name: string;
  code: string;
}

@Component({
  selector: 'app-country-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './country-management.component.html',
  styleUrls: ['./country-management.component.scss'],
})
export class CountryManagementComponent implements OnInit {
  countries: Country[] = [];
  countryForm: FormGroup;
  editingCountry: Country | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private countryService: CountryService,
  ) {
    this.countryForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadCountries();
  }

  loadCountries() {
    this.loading = true;
    this.countryService.getCountries().subscribe({
      next: (countries) => {
        this.countries = countries;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar países';
        this.loading = false;
      },
    });
  }

  submit() {
    if (this.countryForm.invalid) return;
    const country: Country = this.countryForm.value;
    this.loading = true;
    if (this.editingCountry) {
      this.countryService.updateCountry(this.editingCountry.id!, country).subscribe({
        next: () => {
          this.loadCountries();
          this.cancelEdit();
        },
        error: () => {
          this.error = 'Error al editar país';
          this.loading = false;
        },
      });
    } else {
      this.countryService.createCountry(country).subscribe({
        next: () => {
          this.loadCountries();
          this.countryForm.reset();
        },
        error: () => {
          this.error = 'Error al crear país';
          this.loading = false;
        },
      });
    }
  }

  edit(country: Country) {
    this.editingCountry = country;
    this.countryForm.patchValue(country);
  }

  cancelEdit() {
    this.editingCountry = null;
    this.countryForm.reset();
  }
}
