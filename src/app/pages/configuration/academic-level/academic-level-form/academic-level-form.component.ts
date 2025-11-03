import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslocoModule } from '@ngneat/transloco';
import { AcademicLevelService } from '../../../../core/services/academic-level.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { PageTitleComponent } from '../../../../shared/page-title/page-title.component';
import { BreadcrumbItem } from '../../../../shared/page-title/page-title.model';

@Component({
  selector: 'app-academic-level-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslocoModule, PageTitleComponent],
  templateUrl: './academic-level-form.component.html',
  styleUrls: ['./academic-level-form.component.scss'],
})
export class AcademicLevelFormComponent implements OnInit, OnDestroy {
  private readonly formBuilder = inject(FormBuilder);
  private readonly academicLevelService = inject(AcademicLevelService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroy$ = new Subject<void>();

  // Form
  academicLevelForm!: FormGroup;
  isEditMode = false;
  academicLevelId: number | null = null;
  isLoading = false;
  isSubmitting = false;

  // Breadcrumb
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'configuration.title', active: false },
    { label: 'academicLevel.title', active: false },
    { label: 'academicLevel.create', active: true },
  ];

  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Inicializar formulario reactivo
   */
  private initializeForm(): void {
    this.academicLevelForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      isActive: [true],
    });
  }

  /**
   * Verificar si estamos en modo edición
   */
  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.academicLevelId = Number(id);
      this.breadcrumbItems[2] = { label: 'academicLevel.edit', active: true };
      this.loadAcademicLevel(this.academicLevelId);
    }
  }

  /**
   * Cargar datos del nivel académico para edición
   */
  private loadAcademicLevel(id: number): void {
    this.isLoading = true;

    this.academicLevelService
      .getAcademicLevelById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.statusCode === 200 && response.data) {
            this.academicLevelForm.patchValue({
              name: response.data.name,
              isActive: response.data.isActive,
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error loading academic level:', error);
          this.notificationService.showError('academicLevel.loadError');
          this.router.navigate(['/configuration/academic-level']);
        },
      });
  }

  /**
   * Submit del formulario
   */
  onSubmit(): void {
    if (this.academicLevelForm.invalid) {
      this.markFormGroupTouched(this.academicLevelForm);
      this.notificationService.showWarning('common.formValidationError');
      return;
    }

    this.isSubmitting = true;
    const formData = this.academicLevelForm.value;

    const request = this.isEditMode
      ? this.academicLevelService.updateAcademicLevel(this.academicLevelId!, formData)
      : this.academicLevelService.createAcademicLevel(formData);

    request.pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        if (response.statusCode === 200 || response.statusCode === 201) {
          const successMessage = this.isEditMode ? 'academicLevel.updateSuccess' : 'academicLevel.createSuccess';
          this.notificationService.showSuccess(successMessage);
          this.router.navigate(['/configuration/academic-level']);
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error saving academic level:', error);
        const errorMessage = this.isEditMode ? 'academicLevel.updateError' : 'academicLevel.createError';

        // Mostrar mensaje de error del backend si está disponible
        if (error.error && error.error.message) {
          this.notificationService.showError(error.error.message);
        } else {
          this.notificationService.showError(errorMessage);
        }
      },
    });
  }

  /**
   * Marcar todos los campos como touched para mostrar errores
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  /**
   * Verificar si un campo tiene errores
   */
  hasFieldError(fieldName: string): boolean {
    const field = this.academicLevelForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Obtener mensaje de error para un campo
   */
  getFieldError(fieldName: string): string {
    const field = this.academicLevelForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return 'common.validation.required';
    if (field.errors['minlength']) return 'common.validation.minLength';
    if (field.errors['maxlength']) return 'common.validation.maxLength';

    return 'common.validation.invalid';
  }

  /**
   * Cancelar y volver a la lista
   */
  cancel(): void {
    if (this.academicLevelForm.dirty) {
      this.notificationService.showConfirmation('common.confirmCancel').then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/configuration/academic-level']);
        }
      });
    } else {
      this.router.navigate(['/configuration/academic-level']);
    }
  }

  /**
   * Resetear formulario
   */
  resetForm(): void {
    this.academicLevelForm.reset({
      name: '',
      isActive: true,
    });
  }
}
