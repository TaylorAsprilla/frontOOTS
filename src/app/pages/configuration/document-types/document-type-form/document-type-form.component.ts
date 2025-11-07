import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { TranslocoModule } from '@ngneat/transloco';
import { DocumentTypeService } from '../document-type.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-document-type-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslocoModule],
  templateUrl: './document-type-form.component.html',
  styleUrls: ['./document-type-form.component.scss'],
})
export class DocumentTypeFormComponent implements OnInit, OnDestroy {
  documentTypeForm!: FormGroup;
  isEditMode = false;
  documentTypeId?: number;
  isLoading = false;
  isSubmitting = false;
  backendErrors: { [key: string]: string[] } = {};

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private documentTypeService: DocumentTypeService,
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
    this.documentTypeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      isActive: [true],
    });
  }

  checkEditMode(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.documentTypeId = +params['id'];
        this.loadDocumentType(this.documentTypeId);
      }
    });
  }

  loadDocumentType(id: number): void {
    this.isLoading = true;
    this.documentTypeService
      .getDocumentTypeById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.statusCode === 200) {
            this.documentTypeForm.patchValue({
              name: response.data.name,
              isActive: response.data.isActive,
            });
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading document type:', error);
          this.notificationService.showError('Error al cargar el tipo de documento');
          this.isLoading = false;
          this.router.navigate(['/configuration/document-types']);
        },
      });
  }

  onSubmit(): void {
    if (this.documentTypeForm.invalid) {
      Object.keys(this.documentTypeForm.controls).forEach((key) => {
        this.documentTypeForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    this.backendErrors = {};

    const formData = this.documentTypeForm.value;

    const request = this.isEditMode
      ? this.documentTypeService.updateDocumentType(this.documentTypeId!, formData)
      : this.documentTypeService.createDocumentType(formData);

    request.pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        if (response.statusCode === 200 || response.statusCode === 201) {
          const message = this.isEditMode
            ? 'Tipo de documento actualizado exitosamente'
            : 'Tipo de documento creado exitosamente';
          this.notificationService.showSuccess(message);
          this.router.navigate(['/configuration/document-types']);
        }
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error saving document type:', error);

        if (error.error?.message) {
          if (typeof error.error.message === 'object') {
            this.backendErrors = error.error.message;
          } else {
            this.notificationService.showError(error.error.message);
          }
        } else {
          this.notificationService.showError('Error al guardar el tipo de documento');
        }

        this.isSubmitting = false;
      },
    });
  }

  hasError(field: string, error: string): boolean {
    const control = this.documentTypeForm.get(field);
    return !!(control && control.hasError(error) && (control.dirty || control.touched));
  }

  hasBackendError(field: string): boolean {
    return !!this.backendErrors[field];
  }

  getBackendError(field: string): string {
    return this.backendErrors[field]?.[0] || '';
  }

  cancel(): void {
    this.router.navigate(['/configuration/document-types']);
  }
}
