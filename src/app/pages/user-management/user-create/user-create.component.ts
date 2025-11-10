import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { TranslocoModule } from '@ngneat/transloco';
import { NgxIntlTelInputModule, SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';
import { UserService } from '../../../core/services/user.service';
import { NotificationService } from '../../../core/services/notification.service';
import { BreadcrumbItem } from '../../../shared/page-title/page-title.model';
import { DocumentType } from '../../configuration/document-types/document-type.interface';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageTitleComponent, TranslocoModule, NgxIntlTelInputModule],
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss'],
})
export class UserCreateComponent implements OnInit, OnDestroy {
  // Dependency injection with inject()
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);
  private readonly notificationService = inject(NotificationService);
  private readonly destroy$ = new Subject<void>();

  pageTitle: BreadcrumbItem[] = [];
  userForm!: FormGroup;
  isSubmitting = false;

  // Document types from resolver
  documentTypes: DocumentType[] = [];

  // Expose enums for template
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;

  ngOnInit(): void {
    this.setupPageTitle();
    this.loadDocumentTypesFromResolver();
    this.initializeForm();
    this.setupDocumentValidation();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupPageTitle(): void {
    this.pageTitle = [
      { label: 'User Management', path: '/users' },
      { label: 'Users', path: '/users/list' },
      { label: 'Create User', path: '/users/create', active: true },
    ];
  }

  /**
   * Load document types from route resolver
   */
  private loadDocumentTypesFromResolver(): void {
    const resolvedData = this.route.snapshot.data['documentTypes'];
    if (resolvedData && resolvedData.statusCode === 200) {
      this.documentTypes = resolvedData.data;
    } else {
      this.documentTypes = [];
    }
  }

  private initializeForm(): void {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      secondName: ['', [Validators.maxLength(50)]],
      firstLastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      secondLastName: ['', [Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      documentNumber: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
      address: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      city: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      birthDate: ['', [Validators.required]],
      position: ['', [Validators.required, Validators.maxLength(100)]],
      headquarters: ['', [Validators.required, Validators.maxLength(100)]],
      documentTypeId: ['', [Validators.required]],
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  generateRandomPassword(length: number = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  onGeneratePassword(): void {
    const password = this.generateRandomPassword();
    this.userForm.get('password')?.setValue(password);
    this.userForm.get('password')?.markAsDirty();
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.isSubmitting = true;

      // Mapear los datos del formulario al formato esperado por el backend
      const formValue = this.userForm.value;
      const registerRequest = {
        firstName: formValue.firstName?.trim(),
        secondName: formValue.secondName?.trim() || null,
        firstLastName: formValue.firstLastName?.trim(),
        secondLastName: formValue.secondLastName?.trim() || null,
        email: formValue.email?.trim().toLowerCase(),
        phoneNumber: formValue.phoneNumber?.internationalNumber,
        password: formValue.password,
        documentNumber: formValue.documentNumber?.trim(),
        documentTypeId: formValue.documentTypeId,
        address: formValue.address?.trim(),
        city: formValue.city?.trim(),
        birthDate: formValue.birthDate,
        position: formValue.position?.trim(),
        headquarters: formValue.headquarters?.trim(),
      };

      this.userService
        .registerUser(registerRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (user: any) => {
            this.notificationService
              .showSuccess('Usuario registrado exitosamente', {
                title: '¡Éxito!',
                text: `${user.firstName} ${user.firstLastName} ha sido registrado correctamente.`,
                timer: 2000,
              })
              .then(() => {
                this.router.navigate(['/users/details']);
              });
            this.isSubmitting = false;
          },
          error: (error) => {
            this.isSubmitting = false;
            let errorTitle = 'Error al registrar usuario';
            let errorMessage = 'Ocurrió un error al intentar registrar el usuario. Por favor intente nuevamente.';

            // Extraer mensaje de error del backend si está disponible
            if (error?.error?.message) {
              errorMessage = error.error.message;
            } else if (error?.message) {
              errorMessage = error.message;
            }

            this.notificationService.showError(errorMessage, {
              title: errorTitle,
              timer: 0,
              showConfirmButton: true,
            });
          },
        });
    } else {
      this.markFormGroupTouched();
      this.notificationService.showWarning('Por favor completa todos los campos requeridos correctamente.', {
        title: 'Formulario incompleto',
        timer: 4000,
      });
    }
  }

  onCancel(): void {
    // Check if form has any data before showing confirmation
    if (this.userForm.dirty) {
      this.notificationService
        .showConfirmation('Se perderán todos los datos ingresados. ¿Estás seguro de que deseas cancelar?', {
          title: '¿Cancelar creación?',
          confirmButtonText: 'Sí, cancelar',
          cancelButtonText: 'Continuar editando',
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/users/list']);
          }
        });
    } else {
      this.router.navigate(['/users/list']);
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.userForm.controls).forEach((key) => {
      const control = this.userForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Setup document validation to check for duplicates
   */
  private setupDocumentValidation(): void {
    const documentControl = this.userForm.get('documentNumber');
    if (documentControl) {
      documentControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
        if (value && value.length >= 6) {
          this.checkDocumentExists(value);
        }
      });
    }
  }

  /**
   * Check if document number already exists
   */
  private checkDocumentExists(documentNumber: string): void {
    this.userService
      .checkDocumentExists(documentNumber)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (exists) => {
          const documentControl = this.userForm.get('documentNumber');
          if (documentControl) {
            if (exists) {
              documentControl.setErrors({ documentExists: true });
            } else if (documentControl.hasError('documentExists')) {
              // Remove only documentExists error if document is now available
              const errors = { ...documentControl.errors };
              delete errors['documentExists'];
              documentControl.setErrors(Object.keys(errors).length ? errors : null);
            }
          }
        },
        error: (error) => {
          console.error('Error checking document existence:', error);
        },
      });
  }

  /**
   * Get error message for a specific field
   */
  getFieldError(fieldName: string): string {
    const control = this.userForm.get(fieldName);
    if (control && control.errors && control.touched) {
      const errors = control.errors;

      if (errors['required']) return 'user.validation.required';
      if (errors['email']) return 'user.validation.invalidEmail';
      if (errors['minlength']) return 'user.validation.minLength';
      if (errors['maxlength']) return 'user.validation.maxLength';
      if (errors['documentExists']) return 'user.validation.documentExists';
    }

    return '';
  }
}
