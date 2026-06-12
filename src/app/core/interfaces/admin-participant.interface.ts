/**
 * Interfaces para la sección administrativa de Participantes.
 * Tipan la respuesta del endpoint GET /participants/all.
 */

export interface RegisteredByUser {
  id: number;
  firstName: string;
  secondName?: string | null;
  firstLastName: string;
  secondLastName?: string | null;
  email?: string | null;
  username?: string | null;
  status?: string | null;
  roleId?: number | null;
  countryId?: number | null;
}

export interface AdminParticipant {
  id: number;
  firstName: string;
  secondName?: string | null;
  firstLastName: string;
  secondLastName?: string | null;
  documentNumber?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  city?: string | null;
  state?: string | null;
  createdAt?: string | null;
  registeredById?: number | null;
  registeredBy?: RegisteredByUser | null;
}

export interface ParticipantsAllResponse {
  data: AdminParticipant[];
  total: number;
}
