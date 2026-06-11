import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject, delay, map, of, tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../../environments/environment';
import { NotificationService } from '../../../../core/services/notification.service';
import { TokenStorageService } from '../../../../core/services/token-storage.service';
import {
  CaseDiscussion,
  CaseDiscussionStatus,
  CreateCaseDiscussionRequest,
  UpdateCaseDiscussionRequest,
} from '../models/case-discussion.models';

@Injectable({
  providedIn: 'root',
})
export class CaseDiscussionsService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorageService = inject(TokenStorageService);
  private readonly notificationService = inject(NotificationService);

  private readonly apiUrl = `${environment.apiUrl}/cases`;
  private readonly useMockData = true;
  private readonly mockStore = new BehaviorSubject<Record<number, CaseDiscussion[]>>(this.buildInitialStore());

  getDiscussionsByCase(caseId: number): Observable<CaseDiscussion[]> {
    if (this.useMockData) {
      return of(this.getCaseDiscussionsSnapshot(caseId)).pipe(delay(250));
    }

    return this.http
      .get<{ data: CaseDiscussion[] }>(`${this.apiUrl}/${caseId}/discussions`, { headers: this.getHeaders() })
      .pipe(
        map((response) => response.data),
        catchError((error) => this.handleError(error)),
      );
  }

  getDiscussionById(caseId: number, discussionId: number): Observable<CaseDiscussion> {
    if (this.useMockData) {
      const discussion = this.getCaseDiscussionsSnapshot(caseId).find((item) => item.id === discussionId);
      if (!discussion) {
        return this.handleError(new HttpErrorResponse({ status: 404, error: { message: 'Discusión no encontrada' } }));
      }

      return of(structuredClone(discussion)).pipe(delay(180));
    }

    return this.http
      .get<{ data: CaseDiscussion }>(`${this.apiUrl}/${caseId}/discussions/${discussionId}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((response) => response.data),
        catchError((error) => this.handleError(error)),
      );
  }

  createDiscussion(caseId: number, payload: CreateCaseDiscussionRequest): Observable<CaseDiscussion> {
    if (this.useMockData) {
      const store = structuredClone(this.mockStore.value);
      const existing = store[caseId] ?? [];
      const nextId = existing.length ? Math.max(...existing.map((item) => item.id)) + 1 : 1;
      const timestamp = new Date().toISOString();
      const discussion: CaseDiscussion = {
        id: nextId,
        caseId,
        caseNumber: payload.caseNumber,
        participantId: payload.participantId ?? null,
        participantName: payload.participantName,
        socialWorkerName: payload.socialWorkerName,
        supervisorName: payload.supervisorName,
        discussionDate: payload.discussionDate,
        status: payload.status ?? CaseDiscussionStatus.DRAFT,
        clientName: payload.clientName,
        clientAge: payload.clientAge,
        clientSex: payload.clientSex,
        clientMaritalStatus: payload.clientMaritalStatus,
        familyMembers: payload.familyMembers,
        presentingSituations: payload.presentingSituations,
        affectedPeople: payload.affectedPeople,
        socialWorkerRecommendations: payload.socialWorkerRecommendations,
        supervisorRecommendations: payload.supervisorRecommendations,
        createdAt: timestamp,
        updatedAt: timestamp,
        annulledAt: null,
      };

      store[caseId] = [discussion, ...existing];
      this.mockStore.next(store);
      return of(structuredClone(discussion)).pipe(delay(300));
    }

    return this.http
      .post<{ data: CaseDiscussion }>(`${this.apiUrl}/${caseId}/discussions`, payload, { headers: this.getHeaders() })
      .pipe(
        map((response) => response.data),
        catchError((error) => this.handleError(error)),
      );
  }

  updateDiscussion(
    caseId: number,
    discussionId: number,
    payload: UpdateCaseDiscussionRequest,
  ): Observable<CaseDiscussion> {
    if (this.useMockData) {
      return this.updateMockDiscussion(caseId, discussionId, payload);
    }

    return this.http
      .patch<{ data: CaseDiscussion }>(`${this.apiUrl}/${caseId}/discussions/${discussionId}`, payload, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((response) => response.data),
        catchError((error) => this.handleError(error)),
      );
  }

  finalizeDiscussion(caseId: number, discussionId: number): Observable<CaseDiscussion> {
    if (this.useMockData) {
      return this.updateMockDiscussion(caseId, discussionId, { status: CaseDiscussionStatus.FINALIZED });
    }

    return this.http
      .patch<{ data: CaseDiscussion }>(
        `${this.apiUrl}/${caseId}/discussions/${discussionId}/finalize`,
        {},
        {
          headers: this.getHeaders(),
        },
      )
      .pipe(
        map((response) => response.data),
        catchError((error) => this.handleError(error)),
      );
  }

  annulDiscussion(caseId: number, discussionId: number): Observable<CaseDiscussion> {
    if (this.useMockData) {
      return this.updateMockDiscussion(caseId, discussionId, {
        status: CaseDiscussionStatus.ANNULLED,
      }).pipe(
        tap((discussion) => {
          const store = structuredClone(this.mockStore.value);
          store[caseId] = (store[caseId] ?? []).map((item) =>
            item.id === discussionId ? { ...discussion, annulledAt: new Date().toISOString() } : item,
          );
          this.mockStore.next(store);
        }),
      );
    }

    return this.http
      .patch<{ data: CaseDiscussion }>(
        `${this.apiUrl}/${caseId}/discussions/${discussionId}/annul`,
        {},
        {
          headers: this.getHeaders(),
        },
      )
      .pipe(
        map((response) => response.data),
        catchError((error) => this.handleError(error)),
      );
  }

  downloadPdf(caseId: number, discussionId: number): Observable<Blob> {
    if (this.useMockData) {
      const discussion = this.getCaseDiscussionsSnapshot(caseId).find((item) => item.id === discussionId);
      const lines = [
        'Discusion de Casos con el Supervisor',
        `Caso: ${discussion?.caseNumber ?? caseId}`,
        `Participante: ${discussion?.participantName ?? 'N/D'}`,
        `Supervisor: ${discussion?.supervisorName ?? 'N/D'}`,
        `Fecha: ${discussion?.discussionDate ?? 'N/D'}`,
      ];
      return of(new Blob([lines.join('\n')], { type: 'application/pdf' })).pipe(delay(350));
    }

    return this.http
      .get(`${this.apiUrl}/${caseId}/discussions/${discussionId}/pdf`, {
        headers: this.getFileHeaders(),
        responseType: 'blob',
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  private updateMockDiscussion(
    caseId: number,
    discussionId: number,
    payload: UpdateCaseDiscussionRequest,
  ): Observable<CaseDiscussion> {
    const store = structuredClone(this.mockStore.value);
    const discussions = store[caseId] ?? [];
    const index = discussions.findIndex((item) => item.id === discussionId);

    if (index === -1) {
      return this.handleError(new HttpErrorResponse({ status: 404, error: { message: 'Discusión no encontrada' } }));
    }

    const current = discussions[index];
    const updated: CaseDiscussion = {
      ...current,
      ...payload,
      participantId: payload.participantId ?? current.participantId ?? null,
      familyMembers: payload.familyMembers ?? current.familyMembers,
      updatedAt: new Date().toISOString(),
      annulledAt:
        payload.status === CaseDiscussionStatus.ANNULLED ? new Date().toISOString() : (current.annulledAt ?? null),
    };

    discussions[index] = updated;
    store[caseId] = discussions;
    this.mockStore.next(store);
    return of(structuredClone(updated)).pipe(delay(250));
  }

  private getCaseDiscussionsSnapshot(caseId: number): CaseDiscussion[] {
    return structuredClone(this.mockStore.value[caseId] ?? this.createDefaultDiscussions(caseId));
  }

  private getHeaders(): HttpHeaders {
    const token = this.tokenStorageService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  private getFileHeaders(): HttpHeaders {
    const token = this.tokenStorageService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const message =
      error.status === 403
        ? 'No tienes permisos para acceder o modificar esta discusión del caso.'
        : error.error?.message || 'Ocurrió un error al procesar la discusión del caso.';

    this.notificationService.showError(message);
    return throwError(() => error);
  }

  private buildInitialStore(): Record<number, CaseDiscussion[]> {
    return {
      1: this.createDefaultDiscussions(1),
    };
  }

  private createDefaultDiscussions(caseId: number): CaseDiscussion[] {
    return [
      {
        id: 1,
        caseId,
        caseNumber: `CASO-${String(caseId).padStart(4, '0')}`,
        participantId: 10,
        participantName: 'Mariana Torres Rivera',
        socialWorkerName: 'Laura Gomez',
        supervisorName: 'Carlos Pacheco',
        discussionDate: '2026-06-01',
        status: CaseDiscussionStatus.DRAFT,
        clientName: 'Mariana Torres Rivera',
        clientAge: 34,
        clientSex: 'Femenino',
        clientMaritalStatus: 'Soltera',
        familyMembers: [
          { id: 1, name: 'Diego Torres', age: 12, relationship: 'Hijo', occupation: 'Estudiante' },
          { id: 2, name: 'Rosa Rivera', age: 61, relationship: 'Madre', occupation: 'Ama de casa' },
        ],
        presentingSituations:
          'La participante reporta sobrecarga emocional, dificultades economicas y ausencia de red de apoyo inmediata.',
        affectedPeople: 'La participante, su hijo adolescente y su madre adulta mayor.',
        socialWorkerRecommendations:
          'Reforzar plan de visitas domiciliarias, activar red comunitaria y evaluar apoyos institucionales temporales.',
        supervisorRecommendations:
          'Priorizar plan de seguridad, documentar factores de riesgo y coordinar interconsulta con psicologia.',
        createdAt: '2026-06-01T10:15:00.000Z',
        updatedAt: '2026-06-01T10:15:00.000Z',
        annulledAt: null,
      },
      {
        id: 2,
        caseId,
        caseNumber: `CASO-${String(caseId).padStart(4, '0')}`,
        participantId: 10,
        participantName: 'Mariana Torres Rivera',
        socialWorkerName: 'Laura Gomez',
        supervisorName: 'Ana Morales',
        discussionDate: '2026-05-16',
        status: CaseDiscussionStatus.FINALIZED,
        clientName: 'Mariana Torres Rivera',
        clientAge: 34,
        clientSex: 'Femenino',
        clientMaritalStatus: 'Soltera',
        familyMembers: [{ id: 3, name: 'Diego Torres', age: 12, relationship: 'Hijo', occupation: 'Estudiante' }],
        presentingSituations: 'Seguimiento a incumplimiento escolar y tension familiar sostenida.',
        affectedPeople: 'Cliente principal y su grupo familiar primario.',
        socialWorkerRecommendations: 'Mantener seguimiento quincenal y validar apoyos escolares.',
        supervisorRecommendations: 'Escalar a mesa interdisciplinaria si persiste el ausentismo.',
        createdAt: '2026-05-16T14:00:00.000Z',
        updatedAt: '2026-05-18T09:30:00.000Z',
        annulledAt: null,
      },
    ];
  }
}
