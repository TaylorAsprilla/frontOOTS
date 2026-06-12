import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { AdminCase, CasesAllResponse } from '../interfaces/admin-case.interface';

/**
 * Servicio para operaciones administrativas sobre casos.
 *
 * Consume endpoints reservados al rol ADMIN. El token JWT se adjunta
 * automáticamente mediante el `AuthInterceptor`.
 */
@Injectable({ providedIn: 'root' })
export class AdminCasesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/cases`;

  /**
   * Obtiene todos los casos registrados en la plataforma
   * junto con la información del participante y del profesional asignado.
   *
   * Endpoint: GET {apiUrl}/cases/all
   *
   * Normaliza distintas envolturas de respuesta del backend a
   * `{ data: AdminCase[]; total: number }`.
   */
  getAllCases(): Observable<CasesAllResponse> {
    return this.http.get<unknown>(`${this.apiUrl}/all`).pipe(
      map((raw) => this.normalizeResponse(raw)),
      catchError((error) => {
        console.error('[AdminCasesService] getAllCases error', error);
        return throwError(() => error);
      }),
    );
  }

  /**
   * Acepta cualquiera de estas formas y devuelve siempre
   * `{ data: AdminCase[]; total: number }`:
   *
   *  - `{ data: AdminCase[]; total }`
   *  - `{ data: { data: AdminCase[]; total } }`
   *  - `{ data: { cases: AdminCase[]; total } }`
   *  - `AdminCase[]` (array directo)
   */
  private normalizeResponse(raw: unknown): CasesAllResponse {
    if (Array.isArray(raw)) {
      return { data: raw as AdminCase[], total: raw.length };
    }

    if (raw && typeof raw === 'object') {
      const obj = raw as Record<string, unknown>;

      if (Array.isArray(obj['data'])) {
        const data = obj['data'] as AdminCase[];
        const total = typeof obj['total'] === 'number' ? (obj['total'] as number) : data.length;
        return { data, total };
      }

      const inner = obj['data'];
      if (inner && typeof inner === 'object') {
        const innerObj = inner as Record<string, unknown>;

        if (Array.isArray(innerObj['data'])) {
          const data = innerObj['data'] as AdminCase[];
          const total = typeof innerObj['total'] === 'number' ? (innerObj['total'] as number) : data.length;
          return { data, total };
        }
        if (Array.isArray(innerObj['cases'])) {
          const data = innerObj['cases'] as AdminCase[];
          const total = typeof innerObj['total'] === 'number' ? (innerObj['total'] as number) : data.length;
          return { data, total };
        }
      }

      if (Array.isArray(obj['cases'])) {
        const data = obj['cases'] as AdminCase[];
        const total = typeof obj['total'] === 'number' ? (obj['total'] as number) : data.length;
        return { data, total };
      }
    }

    console.warn('[AdminCasesService] Unrecognized response shape, returning empty list', raw);
    return { data: [], total: 0 };
  }
}
