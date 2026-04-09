import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RoleService } from '../services/role.service';
import { TokenStorageService } from '../services/token-storage.service';
import { UserRole } from '../interfaces/auth.interface';

/**
 * Guard de rutas basado en roles.
 *
 * Uso en rutas:
 * ```ts
 * {
 *   path: 'audit-logs',
 *   canActivate: [roleGuard(['ADMIN', 'COORDINADOR', 'SUPERVISOR'])],
 *   loadComponent: () => import('...'),
 * }
 * ```
 */
export function roleGuard(allowedRoles: UserRole[]): CanActivateFn {
  return () => {
    const tokenStorage = inject(TokenStorageService);
    const roleService = inject(RoleService);
    const router = inject(Router);

    if (!tokenStorage.isAuthenticated()) {
      router.navigate(['/auth/login']);
      return false;
    }

    if (roleService.hasAnyRole(...allowedRoles)) {
      return true;
    }

    // Usuario autenticado pero sin el rol requerido → redirigir al dashboard
    router.navigate(['/dashboard']);
    return false;
  };
}
