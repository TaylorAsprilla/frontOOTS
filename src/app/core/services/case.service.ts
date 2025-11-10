import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { TokenStorageService } from './token-storage.service';
import { NotificationService } from './notification.service';
import {
  Case,
  CaseResponse,
  CaseListResponse,
  CasesByUserResponse,
  CreateCaseDto,
  CaseStatus,
} from '../interfaces/case.interface';

/**
 * Service for managing participant cases
 */
@Injectable({
  providedIn: 'root',
})
export class CaseService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorageService = inject(TokenStorageService);
  private readonly notificationService = inject(NotificationService);

  private readonly apiUrl = `${environment.apiUrl}/cases`;

  // State management
  private casesSubject = new BehaviorSubject<Case[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public cases$ = this.casesSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();

  /**
   * Get authorization headers with Bearer token
   */
  private getHeaders(): HttpHeaders {
    const token = this.tokenStorageService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  /**
   * Get all cases with optional filtering
   */
  getCases(filters?: {
    page?: number;
    limit?: number;
    participantId?: number;
    status?: CaseStatus;
  }): Observable<CaseListResponse> {
    this.loadingSubject.next(true);

    let params = '';
    if (filters) {
      const searchParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
      params = searchParams.toString() ? `?${searchParams.toString()}` : '';
    }

    return this.http.get<CaseListResponse>(`${this.apiUrl}${params}`, { headers: this.getHeaders() }).pipe(
      map((response) => {
        this.casesSubject.next(response.data);
        this.loadingSubject.next(false);
        return response;
      }),
      catchError((error) => {
        this.loadingSubject.next(false);
        this.notificationService.showError(error.error?.message || 'Error al cargar los casos');
        return throwError(() => error);
      })
    );
  }

  /**
   * Get a single case by ID
   */
  getCaseById(id: number): Observable<CaseResponse> {
    this.loadingSubject.next(true);

    return this.http.get<CaseResponse>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      tap(() => this.loadingSubject.next(false)),
      catchError((error) => {
        this.loadingSubject.next(false);
        this.notificationService.showError(error.error?.message || 'Error al cargar el caso');
        return throwError(() => error);
      })
    );
  }

  /**
   * Get cases by participant ID
   */
  getCasesByParticipantId(participantId: number): Observable<CaseListResponse> {
    return this.getCases({ participantId });
  }

  /**
   * Get cases by user ID
   */
  getCasesByUserId(userId: number): Observable<CasesByUserResponse> {
    this.loadingSubject.next(true);

    return this.http.get<CasesByUserResponse>(`${this.apiUrl}/by-user/${userId}`, { headers: this.getHeaders() }).pipe(
      tap((response) => {
        this.loadingSubject.next(false);
      }),
      catchError((error) => {
        this.loadingSubject.next(false);
        this.notificationService.showError(error.error?.message || 'Error al cargar los casos del usuario');
        return throwError(() => error);
      })
    );
  }

  /**
   * Create a new case
   */
  createCase(caseData: CreateCaseDto): Observable<CaseResponse> {
    this.loadingSubject.next(true);

    return this.http.post<CaseResponse>(this.apiUrl, caseData, { headers: this.getHeaders() }).pipe(
      tap((response) => {
        this.loadingSubject.next(false);
        this.notificationService.showSuccess('Caso creado exitosamente');

        // Update the cases list
        const currentCases = this.casesSubject.value;
        this.casesSubject.next([...currentCases, response.data]);
      }),
      catchError((error) => {
        this.loadingSubject.next(false);
        this.notificationService.showError(error.error?.message || 'Error al crear el caso');
        return throwError(() => error);
      })
    );
  }

  /**
   * Update an existing case
   */
  updateCase(id: number, caseData: Partial<CreateCaseDto>): Observable<CaseResponse> {
    this.loadingSubject.next(true);

    return this.http.put<CaseResponse>(`${this.apiUrl}/${id}`, caseData, { headers: this.getHeaders() }).pipe(
      tap((response) => {
        this.loadingSubject.next(false);
        this.notificationService.showSuccess('Caso actualizado exitosamente');

        // Update the cases list
        const currentCases = this.casesSubject.value;
        const index = currentCases.findIndex((c) => c.id === id);
        if (index !== -1) {
          currentCases[index] = response.data;
          this.casesSubject.next([...currentCases]);
        }
      }),
      catchError((error) => {
        this.loadingSubject.next(false);
        this.notificationService.showError(error.error?.message || 'Error al actualizar el caso');
        return throwError(() => error);
      })
    );
  }

  /**
   * Close a case
   */
  closeCase(id: number, closingNote: any): Observable<CaseResponse> {
    return this.http
      .patch<CaseResponse>(`${this.apiUrl}/${id}/close`, closingNote, { headers: this.getHeaders() })
      .pipe(
        tap(() => {
          this.notificationService.showSuccess('Caso cerrado exitosamente');
        }),
        catchError((error) => {
          this.notificationService.showError(error.error?.message || 'Error al cerrar el caso');
          return throwError(() => error);
        })
      );
  }

  /**
   * Delete a case
   */
  deleteCase(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      tap(() => {
        this.notificationService.showSuccess('Caso eliminado exitosamente');

        // Update the cases list
        const currentCases = this.casesSubject.value;
        this.casesSubject.next(currentCases.filter((c) => c.id !== id));
      }),
      catchError((error) => {
        this.notificationService.showError(error.error?.message || 'Error al eliminar el caso');
        return throwError(() => error);
      })
    );
  }
}
