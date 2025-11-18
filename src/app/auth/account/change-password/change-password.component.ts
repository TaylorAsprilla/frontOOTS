import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';

import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ChangePasswordDto } from 'src/app/core/interfaces/auth.interface';
import { passwordMatchValidator } from 'src/app/core/validators/password-match.validator';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslocoModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm!: FormGroup;
  loading = false;
  submitted = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  // Control de visibilidad de contraseñas
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(private fb: FormBuilder, private authService: AuthenticationService, private router: Router) {}

  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Inicializar formulario con validaciones
   */
  private initForm(): void {
    this.changePasswordForm = this.fb.group(
      {
        currentPassword: ['', [Validators.required, Validators.minLength(6)]],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: passwordMatchValidator('newPassword', 'confirmPassword'),
      }
    );
  }

  /**
   * Acceso rápido a los controles del formulario
   */
  get f() {
    return this.changePasswordForm.controls;
  }

  /**
   * Toggle visibilidad de contraseña
   */
  togglePasswordVisibility(field: 'current' | 'new' | 'confirm'): void {
    switch (field) {
      case 'current':
        this.showCurrentPassword = !this.showCurrentPassword;
        break;
      case 'new':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirm':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
    }
  }

  /**
   * Enviar formulario
   */
  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = null;
    this.successMessage = null;

    // Validar formulario
    if (this.changePasswordForm.invalid) {
      return;
    }

    this.loading = true;

    const payload: ChangePasswordDto = this.changePasswordForm.value;

    this.authService.changePassword(payload).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = response.message || 'Contraseña cambiada exitosamente.';

        // Esperar 2 segundos y luego cerrar sesión
        setTimeout(() => {
          this.authService.logout();
          this.router.navigate(['/auth/login'], {
            queryParams: { message: 'password_changed' },
          });
        }, 2000);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error;
        console.error('Error al cambiar contraseña:', error);
      },
    });
  }

  /**
   * Cancelar y volver
   */
  onCancel(): void {
    this.router.navigate(['/dashboard']);
  }
}
