import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenStorageService } from './token-storage.service';

export type ReviewType = 'CASE_FILE' | 'SUPERVISEE_FILE';
export type ReviewStatus = 'DRAFT' | 'SIGNED';
export type ItemStatus = 'COMPLETE' | 'MISPLACED' | 'INCOMPLETE' | 'MISSING' | 'WRITING_ERRORS' | 'NOT_APPLICABLE';

/** Leyenda del formato en papel: ✓ X IN ? R N/A */
export const ITEM_STATUSES: { value: ItemStatus; symbol: string; label: string }[] = [
  { value: 'COMPLETE', symbol: '✓', label: 'Completo' },
  { value: 'MISPLACED', symbol: 'X', label: 'Fuera de lugar' },
  { value: 'INCOMPLETE', symbol: 'IN', label: 'Incompleto' },
  { value: 'MISSING', symbol: '?', label: 'No está el documento' },
  { value: 'WRITING_ERRORS', symbol: 'R', label: 'Errores de redacción' },
  { value: 'NOT_APPLICABLE', symbol: 'N/A', label: 'No aplica' },
];

export interface CatalogItem {
  key: string;
  label: string;
  group: string;
}

export type SupervisionCatalog = Record<ReviewType, CatalogItem[]>;

export interface SupervisionPerson {
  id: number;
  firstName?: string;
  firstLastName?: string;
  roleName?: string;
}

export interface CaseSearchResult {
  id: number;
  caseNumber?: string;
  status?: string;
  participantName: string;
}

export interface SupervisionReview {
  id: number;
  type: ReviewType;
  caseId?: number | null;
  case?: { id: number; caseNumber?: string; participant?: { firstName?: string; firstLastName?: string } } | null;
  superviseeId?: number | null;
  supervisee?: SupervisionPerson | null;
  reviewer?: SupervisionPerson;
  period?: string | null;
  casesCount?: number | null;
  items: Record<string, ItemStatus>;
  recommendations?: string | null;
  status: ReviewStatus;
  signedAt?: string | null;
  createdAt: string;
}

export interface CreateReviewPayload {
  type: ReviewType;
  caseId?: number;
  superviseeId?: number;
  period?: string;
  casesCount?: number;
  items?: Record<string, ItemStatus>;
}

export interface UpdateReviewPayload {
  period?: string;
  casesCount?: number;
  items?: Record<string, ItemStatus>;
  recommendations?: string;
}

/** Revisiones de supervisión (Orden de Expediente / Orden de Expediente de Supervisión) */
@Injectable({ providedIn: 'root' })
export class SupervisionService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorage = inject(TokenStorageService);
  private readonly apiUrl = `${environment.apiUrl}/supervision-reviews`;

  private headers(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.tokenStorage.getToken()}` });
  }

  catalog(): Observable<SupervisionCatalog> {
    return this.http
      .get<{ data: SupervisionCatalog }>(`${this.apiUrl}/catalog`, { headers: this.headers() })
      .pipe(map((response) => response.data));
  }

  supervisees(): Observable<SupervisionPerson[]> {
    return this.http
      .get<{ data: SupervisionPerson[] }>(`${this.apiUrl}/supervisees`, { headers: this.headers() })
      .pipe(map((response) => response.data ?? []));
  }

  searchCases(term: string): Observable<CaseSearchResult[]> {
    const params = new HttpParams().set('q', term);
    return this.http
      .get<{ data: CaseSearchResult[] }>(`${this.apiUrl}/cases/search`, { headers: this.headers(), params })
      .pipe(map((response) => response.data ?? []));
  }

  suggestions(caseId: number): Observable<Record<string, ItemStatus>> {
    return this.http
      .get<{ data: Record<string, ItemStatus> }>(`${this.apiUrl}/suggestions/${caseId}`, { headers: this.headers() })
      .pipe(map((response) => response.data ?? {}));
  }

  list(filters: { type?: ReviewType; caseId?: number; superviseeId?: number } = {}): Observable<SupervisionReview[]> {
    let params = new HttpParams();
    if (filters.type) params = params.set('type', filters.type);
    if (filters.caseId) params = params.set('caseId', filters.caseId);
    if (filters.superviseeId) params = params.set('superviseeId', filters.superviseeId);
    return this.http
      .get<{ data: SupervisionReview[] }>(this.apiUrl, { headers: this.headers(), params })
      .pipe(map((response) => response.data ?? []));
  }

  get(id: number): Observable<SupervisionReview> {
    return this.http
      .get<{ data: SupervisionReview }>(`${this.apiUrl}/${id}`, { headers: this.headers() })
      .pipe(map((response) => response.data));
  }

  create(payload: CreateReviewPayload): Observable<SupervisionReview> {
    return this.http
      .post<{ data: SupervisionReview }>(this.apiUrl, payload, { headers: this.headers() })
      .pipe(map((response) => response.data));
  }

  update(id: number, payload: UpdateReviewPayload): Observable<SupervisionReview> {
    return this.http
      .patch<{ data: SupervisionReview }>(`${this.apiUrl}/${id}`, payload, { headers: this.headers() })
      .pipe(map((response) => response.data));
  }

  sign(id: number): Observable<SupervisionReview> {
    return this.http
      .post<{ data: SupervisionReview }>(`${this.apiUrl}/${id}/sign`, {}, { headers: this.headers() })
      .pipe(map((response) => response.data));
  }

  downloadPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/pdf`, { headers: this.headers(), responseType: 'blob' });
  }
}
