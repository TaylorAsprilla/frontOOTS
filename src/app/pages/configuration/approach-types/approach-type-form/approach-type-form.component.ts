import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { TranslocoModule } from '@ngneat/transloco';
import { ApproachTypeService } from '../approach-type.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-approach-type-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslocoModule],
  templateUrl: './approach-type-form.component.html',
  styleUrls: ['./approach-type-form.component.scss'],
})
export class ApproachTypeFormComponent implements OnInit, OnDestroy {
  approachTypeForm!: FormGroup;
  isEditMode = false;
  approachTypeId?: number;
  isLoading = false;
  isSubmitting = false;
  backendErrors: { [key: string]: string[] } = {};

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private approachTypeService: ApproachTypeService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeForm(): void {
    this.approachTypeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      isActive: [true],
    });
  }

  checkEditMode(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.approachTypeId = +params['id'];
        this.loadApproachType(this.approachTypeId);
      }
    });
  }

  loadApproachType(id: number): void {
    this.isLoading = true;
    this.approachTypeService
      .getById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.approachTypeForm.patchValue(response.data);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading approach type:', error);
          this.notificationService.showError('Error al cargar el tipo de enfoque');
          this.isLoading = false;
          this.router.navigate(['/configuration/approach-types']);
        },
      });
  }

  onSubmit(): void {
    if (this.approachTypeForm.invalid) {
      Object.keys(this.approachTypeForm.controls).forEach((key) => {
        this.approachTypeForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    this.backendErrors = {};

    const formData = this.approachTypeForm.value;

    const request = this.isEditMode
      ? this.approachTypeService.update(this.approachTypeId!, formData)
      : this.approachTypeService.create(formData);

    request.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        const message = this.isEditMode
          ? 'Tipo de enfoque actualizado exitosamente'
          : 'Tipo de enfoque creado exitosamente';
        this.notificationService.showSuccess(message);
        this.router.navigate(['/configuration/approach-types']);
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error saving approach type:', error);
        this.notificationService.showError('Error al guardar el tipo de enfoque');
        this.isSubmitting = false;
      },
    });
  }

  hasError(field: string, error: string): boolean {
    const control = this.approachTypeForm.get(field);
    return !!(control && control.hasError(error) && (control.dirty || control.touched));
  }

  hasBackendError(field: string): boolean {
    return !!this.backendErrors[field];
  }

  getBackendError(field: string): string {
    return this.backendErrors[field]?.[0] || '';
  }

  cancel(): void {
    this.router.navigate(['/configuration/approach-types']);
  }
}
