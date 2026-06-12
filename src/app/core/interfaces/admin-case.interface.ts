import { CaseStatus } from './case.interface';

/**
 * Interfaces para la sección administrativa de Casos.
 * Tipan la respuesta del endpoint GET /cases/all.
 */

export interface AdminCaseParticipant {
  id: number;
  firstName?: string | null;
  secondName?: string | null;
  firstLastName?: string | null;
  secondLastName?: string | null;
  documentNumber?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  city?: string | null;
  state?: string | null;
}

export interface AdminCaseProfessional {
  id: number;
  firstName?: string | null;
  secondName?: string | null;
  firstLastName?: string | null;
  secondLastName?: string | null;
  email?: string | null;
  username?: string | null;
  status?: string | null;
  roleId?: number | null;
}

export interface AdminCase {
  id: number;
  caseNumber?: string | null;
  status?: CaseStatus | string | null;
  consultationReason?: string | null;
  intervention?: string | null;
  referrals?: string | null;
  closingNote?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  closedAt?: string | null;

  participantId?: number | null;
  participant?: AdminCaseParticipant | null;

  createdById?: number | null;
  createdBy?: AdminCaseProfessional | null;
}

export interface CasesAllResponse {
  data: AdminCase[];
  total: number;
}
