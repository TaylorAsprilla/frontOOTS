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

  isAdminCountry(): boolean {
    return this.hasAnyRole('ADMIN_COUNTRY');
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

  isTrabajoSocial(): boolean {
    return this.hasAnyRole('TRABAJO_SOCIAL');
  }

  /** Puede acceder a auditoría: ADMIN, COORDINADOR o SUPERVISOR */
  canViewAuditLogs(): boolean {
    return this.hasAnyRole('ADMIN', 'COORDINADOR', 'SUPERVISOR');
  }

  /** Puede gestionar usuarios: ADMIN, ADMIN_COUNTRY (solo su país, lo valida el backend) o COORDINADOR */
  canManageUsers(): boolean {
    return this.hasAnyRole('ADMIN', 'ADMIN_COUNTRY', 'COORDINADOR');
  }

  /** Puede transferir casos entre profesionales: ADMIN, ADMIN_COUNTRY (casos de su país), COORDINADOR o SUPERVISOR */
  canTransferCases(): boolean {
    return this.hasAnyRole('ADMIN', 'ADMIN_COUNTRY', 'COORDINADOR', 'SUPERVISOR');
  }

  /** Puede aprobar informes de transferencia: SUPERVISOR, ADMIN o ADMIN_COUNTRY (casos de su país) */
  canApproveTransfers(): boolean {
    return this.hasAnyRole('ADMIN', 'ADMIN_COUNTRY', 'SUPERVISOR');
  }

  /** Puede consultar revisiones de supervisión: SUPERVISOR, ADMIN o ADMIN_COUNTRY (solo su país) */
  canViewSupervision(): boolean {
    return this.hasAnyRole('ADMIN', 'ADMIN_COUNTRY', 'SUPERVISOR');
  }

  /** Puede elaborar y firmar revisiones de supervisión: SUPERVISOR o ADMIN */
  canSupervise(): boolean {
    return this.hasAnyRole('ADMIN', 'SUPERVISOR');
  }

  /** Puede elaborar informes de transferencia (profesionales que tienen casos asignados) */
  canWriteTransferReports(): boolean {
    return this.hasAnyRole('ADMIN', 'COORDINADOR', 'SUPERVISOR', 'PSICOLOGO', 'ORIENTADOR', 'TRABAJO_SOCIAL');
  }
}
