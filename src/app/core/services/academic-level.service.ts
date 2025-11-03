import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  AcademicLevel,
  AcademicLevelFormData,
  AcademicLevelResponse,
  AcademicLevelListResponse,
} from '../interfaces/academic-level.interface';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AcademicLevelService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorageService = inject(TokenStorageService);
  private readonly apiUrl = `${environment.apiUrl}/academic-levels`;

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  /**
   * Obtener headers con token de autorización
   */
  private getHeaders(): HttpHeaders {
    const token = this.tokenStorageService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  /**
   * Obtener todos los niveles académicos
   */
  getAcademicLevels(): Observable<AcademicLevelListResponse> {
    this.loadingSubject.next(true);

    return this.http
      .get<AcademicLevelListResponse>(this.apiUrl, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap(() => this.loadingSubject.next(false)),
        catchError((error) => {
          this.loadingSubject.next(false);
          throw error;
        })
      );
  }

  /**
   * Obtener un nivel académico por ID
   */
  getAcademicLevelById(id: number): Observable<AcademicLevelResponse> {
    this.loadingSubject.next(true);

    return this.http
      .get<AcademicLevelResponse>(`${this.apiUrl}/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap(() => this.loadingSubject.next(false)),
        catchError((error) => {
          this.loadingSubject.next(false);
          throw error;
        })
      );
  }

  /**
   * Crear un nuevo nivel académico
   */
  createAcademicLevel(data: AcademicLevelFormData): Observable<AcademicLevelResponse> {
    this.loadingSubject.next(true);

    return this.http
      .post<AcademicLevelResponse>(this.apiUrl, data, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap(() => this.loadingSubject.next(false)),
        catchError((error) => {
          this.loadingSubject.next(false);
          throw error;
        })
      );
  }

  /**
   * Actualizar un nivel académico existente
   */
  updateAcademicLevel(id: number, data: AcademicLevelFormData): Observable<AcademicLevelResponse> {
    this.loadingSubject.next(true);

    return this.http
      .patch<AcademicLevelResponse>(`${this.apiUrl}/${id}`, data, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap(() => this.loadingSubject.next(false)),
        catchError((error) => {
          this.loadingSubject.next(false);
          throw error;
        })
      );
  }

  /**
   * Eliminar un nivel académico
   */
  deleteAcademicLevel(id: number): Observable<AcademicLevelResponse> {
    this.loadingSubject.next(true);

    return this.http
      .delete<AcademicLevelResponse>(`${this.apiUrl}/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap(() => this.loadingSubject.next(false)),
        catchError((error) => {
          this.loadingSubject.next(false);
          throw error;
        })
      );
  }

  /**
   * Cambiar estado activo/inactivo de un nivel académico
   */
  toggleActiveStatus(id: number, isActive: boolean): Observable<AcademicLevelResponse> {
    return this.updateAcademicLevel(id, { name: '', isActive });
  }
}
