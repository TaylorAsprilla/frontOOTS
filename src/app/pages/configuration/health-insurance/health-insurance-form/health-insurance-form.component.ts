import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HealthInsuranceService } from '../health-insurance.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-health-insurance-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './health-insurance-form.component.html',
  styleUrl: './health-insurance-form.component.scss',
})
export class HealthInsuranceFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly healthInsuranceService = inject(HealthInsuranceService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  healthInsuranceForm: FormGroup;
  isEditMode = false;
  healthInsuranceId: number | null = null;
  isLoading = false;
  isSubmitting = false;

  constructor() {
    this.healthInsuranceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      isActive: [true],
    });
  }

  ngOnInit(): void {
    this.checkEditMode();
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.healthInsuranceId = +id;
      this.loadHealthInsurance(this.healthInsuranceId);
    }
  }

  private loadHealthInsurance(id: number): void {
    this.isLoading = true;
    this.healthInsuranceService.getHealthInsuranceById(id).subscribe({
      next: (response) => {
        this.healthInsuranceForm.patchValue(response.data);
        this.isLoading = false;
      },
      error: () => {
        this.notificationService.showError('Error al cargar el EPS');
        this.router.navigate(['/configuration/health-insurance']);
        this.isLoading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.healthInsuranceForm.invalid) {
      this.healthInsuranceForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formData = this.healthInsuranceForm.value;

    const request = this.isEditMode
      ? this.healthInsuranceService.updateHealthInsurance(this.healthInsuranceId!, formData)
      : this.healthInsuranceService.createHealthInsurance(formData);

    request.subscribe({
      next: () => {
        this.notificationService.showSuccess(
          this.isEditMode ? 'Estado civil actualizado correctamente' : 'Estado civil creado correctamente'
        );
        this.router.navigate(['/configuration/health-insurance']);
      },
      error: () => {
        this.notificationService.showError('Error al guardar el EPS');
        this.isSubmitting = false;
      },
    });
  }

  hasFieldError(fieldName: string): boolean {
    const field = this.healthInsuranceForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.healthInsuranceForm.get(fieldName);
    if (field?.hasError('required')) return 'Este campo es requerido';
    if (field?.hasError('minlength')) return 'Mínimo 2 caracteres';
    if (field?.hasError('maxlength')) return 'Máximo 100 caracteres';
    return '';
  }
}
