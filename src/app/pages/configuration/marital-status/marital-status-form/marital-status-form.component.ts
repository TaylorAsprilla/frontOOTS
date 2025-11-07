import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MaritalStatusService } from '../marital-status.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-marital-status-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './marital-status-form.component.html',
  styleUrl: './marital-status-form.component.scss',
})
export class MaritalStatusFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly maritalStatusService = inject(MaritalStatusService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  maritalStatusForm: FormGroup;
  isEditMode = false;
  maritalStatusId: number | null = null;
  isLoading = false;
  isSubmitting = false;

  constructor() {
    this.maritalStatusForm = this.fb.group({
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
      this.maritalStatusId = +id;
      this.loadMaritalStatus(this.maritalStatusId);
    }
  }

  private loadMaritalStatus(id: number): void {
    this.isLoading = true;
    this.maritalStatusService.getMaritalStatusById(id).subscribe({
      next: (response) => {
        this.maritalStatusForm.patchValue(response.data);
        this.isLoading = false;
      },
      error: () => {
        this.notificationService.showError('Error al cargar el estado civil');
        this.router.navigate(['/configuration/marital-status']);
        this.isLoading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.maritalStatusForm.invalid) {
      this.maritalStatusForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formData = this.maritalStatusForm.value;

    const request = this.isEditMode
      ? this.maritalStatusService.updateMaritalStatus(this.maritalStatusId!, formData)
      : this.maritalStatusService.createMaritalStatus(formData);

    request.subscribe({
      next: () => {
        this.notificationService.showSuccess(
          this.isEditMode ? 'Estado civil actualizado correctamente' : 'Estado civil creado correctamente'
        );
        this.router.navigate(['/configuration/marital-status']);
      },
      error: () => {
        this.notificationService.showError('Error al guardar el estado civil');
        this.isSubmitting = false;
      },
    });
  }

  hasFieldError(fieldName: string): boolean {
    const field = this.maritalStatusForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.maritalStatusForm.get(fieldName);
    if (field?.hasError('required')) return 'Este campo es requerido';
    if (field?.hasError('minlength')) return 'Mínimo 2 caracteres';
    if (field?.hasError('maxlength')) return 'Máximo 100 caracteres';
    return '';
  }
}
