import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { IdentifiedSituationService } from '../../../../core/services/identified-situation.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { PageTitleComponent } from '../../../../shared/page-title/page-title.component';

@Component({
  selector: 'app-identified-situation-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, PageTitleComponent],
  templateUrl: './identified-situation-form.component.html',
  styleUrl: './identified-situation-form.component.scss',
})
export class IdentifiedSituationFormComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly identifiedSituationService = inject(IdentifiedSituationService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroy$ = new Subject<void>();

  situationForm!: FormGroup;
  isEditMode = false;
  situationId: number | null = null;
  isLoading = false;
  isSubmitting = false;

  breadcrumbItems = [
    { label: 'Configuración', link: '/configuration' },
    { label: 'Situaciones Identificadas', link: '/configuration/identified-situations' },
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
    this.situationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      isActive: [true],
    });
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.situationId = +id;
      this.breadcrumbItems[2].label = 'Editar';
      this.loadSituation(this.situationId);
    } else {
      this.breadcrumbItems[2].label = 'Crear';
    }
  }

  private loadSituation(id: number): void {
    this.isLoading = true;
    this.identifiedSituationService
      .getById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (situation) => {
          this.situationForm.patchValue({
            name: situation.name,
            isActive: situation.isActive,
          });
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading identified situation:', error);
          this.notificationService.showError('Error al cargar la situación identificada');
          this.isLoading = false;
          this.router.navigate(['/configuration/identified-situations']);
        },
      });
  }

  onSubmit(): void {
    if (this.situationForm.invalid) {
      Object.keys(this.situationForm.controls).forEach((key) => {
        this.situationForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    const formValue = this.situationForm.value;

    const request$ = this.isEditMode
      ? this.identifiedSituationService.update(this.situationId!, formValue)
      : this.identifiedSituationService.create(formValue);

    request$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        const message = this.isEditMode ? 'Situación actualizada exitosamente' : 'Situación creada exitosamente';
        this.notificationService.showSuccess(message);
        this.router.navigate(['/configuration/identified-situations']);
      },
      error: (error) => {
        console.error('Error saving identified situation:', error);

        // Manejo de errores específicos del backend
        if (error.error?.message) {
          this.notificationService.showError(error.error.message);
        } else {
          const message = this.isEditMode ? 'Error al actualizar la situación' : 'Error al crear la situación';
          this.notificationService.showError(message);
        }
        this.isSubmitting = false;
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/configuration/identified-situations']);
  }

  hasFieldError(fieldName: string): boolean {
    const field = this.situationForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.situationForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Este campo es requerido';
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
