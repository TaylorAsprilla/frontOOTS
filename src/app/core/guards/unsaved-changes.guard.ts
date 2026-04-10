import { CanDeactivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

/**
 * Interface that components must implement to support the unsaved-changes guard.
 */
export interface HasUnsavedChanges {
  hasUnsavedChanges(): boolean;
}

/**
 * Guard that prevents accidental navigation away from a form with unsaved changes.
 * The component must implement `HasUnsavedChanges`.
 */
export const unsavedChangesGuard: CanDeactivateFn<HasUnsavedChanges> = (component) => {
  if (!component.hasUnsavedChanges()) {
    return true;
  }

  return new Promise<boolean>((resolve) => {
    // Use native confirm as a fallback when SweetAlert is not available in this context
    const message = '¿Estás seguro de que deseas salir? Los cambios no guardados se perderán.';
    const confirmed = window.confirm(message);
    resolve(confirmed);
  });
};
