import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { PageTitleComponent } from '../../../shared/page-title/page-title.component';
import { UserService } from '../../../core/services/user.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CreateUserRequest, UserModel } from '../../../core/models/user.model';
import { BreadcrumbItem } from '../../../shared/page-title/page-title.model';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageTitleComponent],
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
      phoneNumber: ['', [Validators.required, Validators.pattern(/^(\+57)?[3][0-9]{9}$/)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      documentNumber: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
      address: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      city: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      birthDate: ['', [Validators.required]],
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.isSubmitting = true;

      const createUserRequest: CreateUserRequest = this.userForm.value;

      console.log('Submitting user creation with data:', createUserRequest);

      this.userService
        .createUser(createUserRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (user: UserModel) => {
            this.isSubmitting = false;

            if (user && user.firstName && user.firstLastName) {
              this.notificationService
                .showSuccess(`Usuario creado exitosamente`, {
                  title: '¡Éxito!',
                  text: `${user.firstName} ${user.firstLastName} ha sido registrado correctamente.`,
                  timer: 3000,
                })
                .then(() => {
                  this.router.navigate(['/users/list']);
                });
            } else {
              console.warn('User creation returned incomplete user data:', user);
              this.notificationService
                .showSuccess('Usuario creado exitosamente', {
                  timer: 2000,
                })
                .then(() => {
                  this.router.navigate(['/users/list']);
                });
            }
          },
          error: (error) => {
            this.isSubmitting = false;

            // Manejo específico de errores con SweetAlert2
            let errorTitle = 'Error al crear usuario';
            let errorMessage = 'Ha ocurrido un error inesperado. Por favor, intenta nuevamente.';

            if (error.status === 400) {
              errorTitle = 'Datos inválidos';
              errorMessage = 'Por favor verifica que todos los campos estén correctamente diligenciados.';
            } else if (error.status === 409) {
              errorTitle = 'Usuario ya existe';
              errorMessage = 'Ya existe un usuario registrado con este email o número de documento.';
            } else if (error.status === 500) {
              errorTitle = 'Error del servidor';
              errorMessage = 'Error interno del servidor. Por favor, intenta más tarde.';
            } else if (error.status === 0) {
              errorTitle = 'Sin conexión';
              errorMessage = 'No se pudo conectar al servidor. Verifica tu conexión a internet.';
            }

            this.notificationService.showError(errorMessage, {
              title: errorTitle,
              timer: 0, // No auto-close for errors
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
