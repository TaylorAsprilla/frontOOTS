import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { TranslocoModule } from '@ngneat/transloco';
import { NgxIntlTelInputModule, SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';

import { PageTitleComponent } from '../../../shared/page-title/page-title.component';
import { UserService } from '../../../core/services/user.service';
import { NotificationService } from '../../../core/services/notification.service';
import { BreadcrumbItem } from '../../../shared/page-title/page-title.model';

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
  private readonly userService = inject(UserService);
  private readonly notificationService = inject(NotificationService);
  private readonly destroy$ = new Subject<void>();

  pageTitle: BreadcrumbItem[] = [];
  userForm!: FormGroup;
  isSubmitting = false;

  // Expose enums for template
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;

  ngOnInit(): void {
    this.setupPageTitle();
    this.initializeForm();
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
      organization: ['', [Validators.required, Validators.maxLength(100)]],
      documentTypeId: [1, [Validators.required]],
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
      const registerRequest = this.userForm.value;
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
            console.log('Error', error);
            this.isSubmitting = false;
            let errorTitle = 'Error al registrar usuario';
            let errorMessage = error;

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
}
