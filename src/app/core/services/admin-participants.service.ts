import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { AdminParticipant, ParticipantsAllResponse } from '../interfaces/admin-participant.interface';

/**
 * Servicio para operaciones administrativas sobre participantes.
 *
 * Consume endpoints reservados al rol ADMIN. El token JWT se adjunta
 * automáticamente mediante el `AuthInterceptor`.
 */
@Injectable({ providedIn: 'root' })
export class AdminParticipantsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/participants`;

  /**
   * Obtiene todos los participantes registrados en la plataforma
   * junto con la información del usuario que los registró/asignó.
   *
   * Endpoint: GET {apiUrl}/participants/all
   *
   * Normaliza distintas formas de respuesta del backend a
   * `{ data: AdminParticipant[]; total: number }`.
   */
  getAllParticipants(): Observable<ParticipantsAllResponse> {
    return this.http.get<unknown>(`${this.apiUrl}/all`).pipe(
      map((raw) => this.normalizeResponse(raw)),
      catchError((error) => {
        console.error('[AdminParticipantsService] getAllParticipants error', error);
        return throwError(() => error);
      }),
    );
  }

  /**
   * Acepta cualquiera de estas formas y devuelve siempre
   * `{ data: AdminParticipant[]; total: number }`:
   *
   *  - `{ data: AdminParticipant[]; total }`
   *  - `{ data: { data: AdminParticipant[]; total } }`
   *  - `{ data: { participants: AdminParticipant[]; total } }`
   *  - `AdminParticipant[]` (array directo)
   */
  private normalizeResponse(raw: unknown): ParticipantsAllResponse {
    if (Array.isArray(raw)) {
      return { data: raw as AdminParticipant[], total: raw.length };
    }

    if (raw && typeof raw === 'object') {
      const obj = raw as Record<string, unknown>;

      // Forma directa: { data: [...], total }
      if (Array.isArray(obj['data'])) {
        const data = obj['data'] as AdminParticipant[];
        const total = typeof obj['total'] === 'number' ? (obj['total'] as number) : data.length;
        return { data, total };
      }

      // Forma envuelta: { data: { ... } }
      const inner = obj['data'];
      if (inner && typeof inner === 'object') {
        const innerObj = inner as Record<string, unknown>;

        if (Array.isArray(innerObj['data'])) {
          const data = innerObj['data'] as AdminParticipant[];
          const total = typeof innerObj['total'] === 'number' ? (innerObj['total'] as number) : data.length;
          return { data, total };
        }
        if (Array.isArray(innerObj['participants'])) {
          const data = innerObj['participants'] as AdminParticipant[];
          const total = typeof innerObj['total'] === 'number' ? (innerObj['total'] as number) : data.length;
          return { data, total };
        }
      }

      // Forma plana con otra clave usual
      if (Array.isArray(obj['participants'])) {
        const data = obj['participants'] as AdminParticipant[];
        const total = typeof obj['total'] === 'number' ? (obj['total'] as number) : data.length;
        return { data, total };
      }
    }

    console.warn('[AdminParticipantsService] Unrecognized response shape, returning empty list', raw);
    return { data: [], total: 0 };
  }
}
