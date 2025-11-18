import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validador personalizado para verificar que dos campos de contraseña coincidan
 * @param passwordField Nombre del campo de contraseña
 * @param confirmPasswordField Nombre del campo de confirmación de contraseña
 * @returns ValidatorFn
 *
 * @example
 * // En el formulario reactivo
 * this.form = this.fb.group({
 *   newPassword: ['', [Validators.required, Validators.minLength(8)]],
 *   confirmPassword: ['', Validators.required]
 * }, {
 *   validators: passwordMatchValidator('newPassword', 'confirmPassword')
 * });
 */
export function passwordMatchValidator(
  passwordField: string = 'newPassword',
  confirmPasswordField: string = 'confirmPassword'
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get(passwordField);
    const confirmPassword = control.get(confirmPasswordField);

    // Si alguno de los campos no existe, retornar null
    if (!password || !confirmPassword) {
      return null;
    }

    // Si el campo de confirmación está vacío, no validar aún
    if (!confirmPassword.value) {
      return null;
    }

    // Comparar las contraseñas
    if (password.value !== confirmPassword.value) {
      // Agregar el error al campo de confirmación
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    // Si las contraseñas coinciden, limpiar el error específico
    if (confirmPassword.hasError('passwordMismatch')) {
      delete confirmPassword.errors?.['passwordMismatch'];
      // Si no hay otros errores, establecer null
      if (Object.keys(confirmPassword.errors || {}).length === 0) {
        confirmPassword.setErrors(null);
      }
    }

    return null;
  };
}

/**
 * Validador alternativo más simple que solo retorna el error a nivel de formulario
 * @param passwordField Nombre del campo de contraseña
 * @param confirmPasswordField Nombre del campo de confirmación de contraseña
 */
export function simplePasswordMatchValidator(
  passwordField: string = 'newPassword',
  confirmPasswordField: string = 'confirmPassword'
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get(passwordField);
    const confirmPassword = control.get(confirmPasswordField);

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  };
}
