import { Injectable, inject } from '@angular/core';
import { TokenStorageService } from './token-storage.service';
import { UserRole } from '../interfaces/auth.interface';

/**
 * Servicio de autorización basado en roles (RBAC).
 */
@Injectable({ providedIn: 'root' })
export class RoleService {
  private readonly tokenStorage = inject(TokenStorageService);

  /** Rol del usuario actualmente autenticado */
  getRole(): UserRole | null {
    return this.tokenStorage.getRole();
  }

  /** Verifica si el usuario tiene uno de los roles indicados */
  hasAnyRole(...roles: UserRole[]): boolean {
    const current = this.getRole();
    return current !== null && roles.includes(current);
  }

  isAdmin(): boolean {
    return this.hasAnyRole('ADMIN');
  }

  isCoordinador(): boolean {
    return this.hasAnyRole('COORDINADOR');
  }

  isSupervisor(): boolean {
    return this.hasAnyRole('SUPERVISOR');
  }

  isPsicologo(): boolean {
    return this.hasAnyRole('PSICOLOGO');
  }

  isOrientador(): boolean {
    return this.hasAnyRole('ORIENTADOR');
  }

  /** Puede acceder a auditoría: ADMIN, COORDINADOR o SUPERVISOR */
  canViewAuditLogs(): boolean {
    return this.hasAnyRole('ADMIN', 'COORDINADOR', 'SUPERVISOR');
  }

  /** Puede gestionar usuarios: ADMIN o COORDINADOR */
  canManageUsers(): boolean {
    return this.hasAnyRole('ADMIN', 'COORDINADOR');
  }
}
