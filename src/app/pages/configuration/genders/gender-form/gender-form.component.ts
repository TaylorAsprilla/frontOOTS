import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { GenderService } from '../gender.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { PageTitleComponent } from '../../../../shared/page-title/page-title.component';

@Component({
  selector: 'app-gender-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, PageTitleComponent],
  templateUrl: './gender-form.component.html',
  styleUrl: './gender-form.component.scss',
})
export class GenderFormComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly genderService = inject(GenderService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroy$ = new Subject<void>();

  genderForm!: FormGroup;
  isEditMode = false;
  genderId: number | null = null;
  isLoading = false;
  isSubmitting = false;

  breadcrumbItems = [
    { label: 'Configuración', link: '/configuration' },
    { label: 'Géneros', link: '/configuration/genders' },
    { label: 'Formulario', active: true },
  ];

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.genderForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      isActive: [true],
    });
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.genderId = +id;
      this.breadcrumbItems[2].label = 'Editar';
      this.loadGender(this.genderId);
    } else {
      this.breadcrumbItems[2].label = 'Crear';
    }
  }

  private loadGender(id: number): void {
    this.isLoading = true;
    this.genderService
      .getGenderById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.statusCode === 200) {
            this.genderForm.patchValue({
              name: response.data.name,
              isActive: response.data.isActive,
            });
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading gender:', error);
          this.notificationService.showError('Error al cargar el género');
          this.isLoading = false;
          this.router.navigate(['/configuration/genders']);
        },
      });
  }

  onSubmit(): void {
    if (this.genderForm.invalid) {
      Object.keys(this.genderForm.controls).forEach((key) => {
        this.genderForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    const formValue = this.genderForm.value;

    const request$ = this.isEditMode
      ? this.genderService.updateGender(this.genderId!, formValue)
      : this.genderService.createGender(formValue);

    request$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        const message = this.isEditMode ? 'Género actualizado exitosamente' : 'Género creado exitosamente';
        this.notificationService.showSuccess(message);
        this.router.navigate(['/configuration/genders']);
      },
      error: (error) => {
        console.error('Error saving gender:', error);

        // Manejo de errores específicos del backend
        if (error.error?.message) {
          this.notificationService.showError(error.error.message);
        } else {
          const message = this.isEditMode ? 'Error al actualizar el género' : 'Error al crear el género';
          this.notificationService.showError(message);
        }
        this.isSubmitting = false;
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/configuration/genders']);
  }

  hasFieldError(fieldName: string): boolean {
    const field = this.genderForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.genderForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'gender.errors.required';
    }
    if (field?.hasError('minlength')) {
      const minLength = field.errors?.['minlength'].requiredLength;
      return `El campo debe tener al menos ${minLength} caracteres`;
    }
    if (field?.hasError('maxlength')) {
      const maxLength = field.errors?.['maxlength'].requiredLength;
      return `El campo no debe superar ${maxLength} caracteres`;
    }
    return '';
  }
}
