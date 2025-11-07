import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IncomeSourceService } from '../income-source.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-income-source-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './income-source-form.component.html',
  styleUrl: './income-source-form.component.scss',
})
export class IncomeSourceFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly incomeSourceService = inject(IncomeSourceService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  incomeSourceForm: FormGroup;
  isEditMode = false;
  incomeSourceId: number | null = null;
  isLoading = false;
  isSubmitting = false;

  constructor() {
    this.incomeSourceForm = this.fb.group({
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
      this.incomeSourceId = +id;
      this.loadIncomeSource(this.incomeSourceId);
    }
  }

  private loadIncomeSource(id: number): void {
    this.isLoading = true;
    this.incomeSourceService.getIncomeSourceById(id).subscribe({
      next: (response) => {
        this.incomeSourceForm.patchValue(response.data);
        this.isLoading = false;
      },
      error: () => {
        this.notificationService.showError('Error al cargar el Fuente de Ingresos');
        this.router.navigate(['/configuration/income-source']);
        this.isLoading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.incomeSourceForm.invalid) {
      this.incomeSourceForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formData = this.incomeSourceForm.value;

    const request = this.isEditMode
      ? this.incomeSourceService.updateIncomeSource(this.incomeSourceId!, formData)
      : this.incomeSourceService.createIncomeSource(formData);

    request.subscribe({
      next: () => {
        this.notificationService.showSuccess(
          this.isEditMode ? 'Estado civil actualizado correctamente' : 'Estado civil creado correctamente'
        );
        this.router.navigate(['/configuration/income-source']);
      },
      error: () => {
        this.notificationService.showError('Error al guardar el Fuente de Ingresos');
        this.isSubmitting = false;
      },
    });
  }

  hasFieldError(fieldName: string): boolean {
    const field = this.incomeSourceForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.incomeSourceForm.get(fieldName);
    if (field?.hasError('required')) return 'Este campo es requerido';
    if (field?.hasError('minlength')) return 'Mínimo 2 caracteres';
    if (field?.hasError('maxlength')) return 'Máximo 100 caracteres';
    return '';
  }
}
