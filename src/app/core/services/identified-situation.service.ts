import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface IdentifiedSituation {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data: T;
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
}

export interface CreateIdentifiedSituationDto {
  name: string;
  isActive?: boolean;
}

export interface UpdateIdentifiedSituationDto {
  name?: string;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class IdentifiedSituationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/identified-situations`;

  /**
   * Get all identified situations
   */
  getAll(): Observable<IdentifiedSituation[]> {
    return this.http.get<ApiResponse<IdentifiedSituation[]>>(this.apiUrl).pipe(
      map((response) => response.data),
      catchError(this.handleError)
    );
  }

  /**
   * Get active identified situations only
   */
  getActive(): Observable<IdentifiedSituation[]> {
    return this.getAll().pipe(map((situations) => situations.filter((situation) => situation.isActive)));
  }

  /**
   * Get identified situation by ID
   */
  getById(id: number): Observable<IdentifiedSituation> {
    return this.http.get<ApiResponse<IdentifiedSituation>>(`${this.apiUrl}/${id}`).pipe(
      map((response) => response.data),
      catchError(this.handleError)
    );
  }

  /**
   * Create new identified situation
   */
  create(data: CreateIdentifiedSituationDto): Observable<IdentifiedSituation> {
    return this.http.post<ApiResponse<IdentifiedSituation>>(this.apiUrl, data).pipe(
      map((response) => response.data),
      catchError(this.handleError)
    );
  }

  /**
   * Update identified situation
   */
  update(id: number, data: UpdateIdentifiedSituationDto): Observable<IdentifiedSituation> {
    return this.http.patch<ApiResponse<IdentifiedSituation>>(`${this.apiUrl}/${id}`, data).pipe(
      map((response) => response.data),
      catchError(this.handleError)
    );
  }

  /**
   * Delete identified situation
   */
  delete(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      map(() => void 0),
      catchError(this.handleError)
    );
  }

  /**
   * Toggle active status
   */
  toggleStatus(id: number, isActive: boolean): Observable<IdentifiedSituation> {
    return this.update(id, { isActive });
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: any): Observable<never> {
    console.error('IdentifiedSituationService Error:', error);
    return throwError(() => error);
  }
}
