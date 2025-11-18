import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { DefaultLayoutComponent } from 'src/app/shared/ui/default-layout/default-layout.component';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { passwordMatchValidator } from 'src/app/core/validators/password-match.validator';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'app-auth-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss'],
  imports: [DefaultLayoutComponent, RouterModule, NgbAlert, ReactiveFormsModule, CommonModule, TranslocoModule],
})
export class RecoverPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  formSubmitted: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  // Determina si estamos en modo "reset" (con token) o "forgot" (sin token)
  isResetMode: boolean = false;
  token: string | null = null;
  tokenValid: boolean = true;

  // Estados de visibilidad de contraseñas
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Verificar si hay un token en la URL (route param o query param)
    this.token = this.route.snapshot.paramMap.get('token') || this.route.snapshot.queryParamMap.get('token');
    this.isResetMode = !!this.token;

    if (this.isResetMode && !this.token) {
      this.tokenValid = false;
      this.errorMessage = 'Token de restablecimiento inválido o no proporcionado';
    }

    this.initForm();
  }

  private initForm(): void {
    if (this.isResetMode) {
      // Formulario para restablecer contraseña con token
      this.resetPasswordForm = this.fb.group(
        {
          password: [
            '',
            [
              Validators.required,
              Validators.minLength(8),
              Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
            ],
          ],
          confirmPassword: ['', [Validators.required]],
        },
        {
          validators: passwordMatchValidator('password', 'confirmPassword'),
        }
      );
    } else {
      // Formulario para solicitar recuperación (solo email)
      this.resetPasswordForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
      });
    }
  }

  /**
   * Convenience getter for easy access to form fields
   */
  get formValues() {
    return this.resetPasswordForm.controls;
  }

  /**
   * Alternar visibilidad de contraseña
   */
  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  /**
   * On form submit
   */
  onSubmit(): void {
    this.formSubmitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.resetPasswordForm.invalid) {
      return;
    }

    this.loading = true;

    if (this.isResetMode) {
      // Restablecer contraseña con token
      this.resetPassword();
    } else {
      // Solicitar recuperación de contraseña
      this.forgotPassword();
    }
  }

  /**
   * Solicitar recuperación de contraseña (forgot-password)
   */
  private forgotPassword(): void {
    const payload = {
      email: this.resetPasswordForm.value.email,
    };

    this.authService.forgotPassword(payload).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage =
          'Si el correo electrónico existe en nuestro sistema, recibirás instrucciones para restablecer tu contraseña.';
      },
      error: (error) => {
        this.loading = false;

        if (error.status === 422) {
          this.errorMessage = 'El correo electrónico ingresado no es válido';
        } else {
          this.errorMessage = 'Error al procesar la solicitud. Intenta nuevamente más tarde.';
        }
      },
    });
  }

  /**
   * Restablecer contraseña con token (reset-password)
   */
  private resetPassword(): void {
    if (!this.token) {
      this.errorMessage = 'Token no válido';
      this.loading = false;
      return;
    }

    const payload = {
      token: this.token,
      newPassword: this.resetPasswordForm.value.password,
      confirmPassword: this.resetPasswordForm.value.confirmPassword,
    };

    this.authService.resetPassword(payload).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Tu contraseña ha sido restablecida exitosamente. Serás redirigido al login.';

        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 3000);
      },
      error: (error) => {
        this.loading = false;

        if (error.status === 400) {
          this.errorMessage = 'Token inválido o expirado. Solicita un nuevo enlace de restablecimiento.';
        } else if (error.status === 404) {
          this.errorMessage = 'Token no encontrado. Solicita un nuevo enlace de restablecimiento.';
        } else if (error.status === 422) {
          this.errorMessage = 'La contraseña no cumple con los requisitos mínimos de seguridad.';
        } else {
          this.errorMessage = 'Error al restablecer la contraseña. Intenta nuevamente más tarde.';
        }
      },
    });
  }

  /**
   * Volver al login
   */
  backToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
