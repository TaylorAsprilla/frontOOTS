import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, filter, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenStorageService } from './token-storage.service';

/** Sección del expediente a la que pertenece el documento */
export type AttachmentContext = 'CONSENT' | 'FOLLOW_UP_REFERRAL' | 'REFERRAL';

export type AttachmentCategory =
  | 'RELEASE_OF_LIABILITY'
  | 'CONFIDENTIALITY'
  | 'PARTICIPATION_CONSENT'
  | 'DATA_AUTHORIZATION'
  | 'REFERRAL_FORM'
  | 'REFERRAL_RESPONSE'
  | 'SUPPORT_DOCUMENT'
  | 'OTHER';

export interface CaseAttachment {
  id: number;
  caseId: number;
  context: AttachmentContext;
  category: AttachmentCategory;
  originalName: string;
  mimeType: string;
  extension: string;
  size: number;
  description: string | null;
  signedAt: string | null;
  createdAt: string;
  uploadedBy: { id: number; name: string } | null;
}

export interface UploadAttachmentParams {
  caseId: number;
  context: AttachmentContext;
  category: AttachmentCategory;
  file: File;
  description?: string;
  signedAt?: string;
}

export type UploadProgress = { progress: number } | { done: CaseAttachment };

export const CATEGORY_LABELS: Record<AttachmentCategory, string> = {
  RELEASE_OF_LIABILITY: 'Relevo de Responsabilidad',
  CONFIDENTIALITY: 'Parámetros de Confidencialidad',
  PARTICIPATION_CONSENT: 'Consentimiento de Participación',
  DATA_AUTHORIZATION: 'Autorización de Tratamiento de Datos Personales',
  REFERRAL_FORM: 'Formulario o carta de referido',
  REFERRAL_RESPONSE: 'Respuesta de la institución',
  SUPPORT_DOCUMENT: 'Documento de soporte',
  OTHER: 'Otros documentos',
};

export const CATEGORIES_BY_CONTEXT: Record<AttachmentContext, AttachmentCategory[]> = {
  CONSENT: ['RELEASE_OF_LIABILITY', 'CONFIDENTIALITY', 'PARTICIPATION_CONSENT', 'DATA_AUTHORIZATION', 'OTHER'],
  FOLLOW_UP_REFERRAL: ['REFERRAL_FORM', 'REFERRAL_RESPONSE', 'SUPPORT_DOCUMENT', 'OTHER'],
  REFERRAL: ['REFERRAL_FORM', 'REFERRAL_RESPONSE', 'SUPPORT_DOCUMENT', 'OTHER'],
};

/** Formatos y tamaño que acepta el backend (que vuelve a validarlos) */
export const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx'];
export const MAX_FILE_MB = 15;

/**
 * Documentos adjuntos de casos y consultas breves (almacenados en S3).
 */
@Injectable({ providedIn: 'root' })
export class CaseAttachmentService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorage = inject(TokenStorageService);
  private readonly apiUrl = `${environment.apiUrl}/case-attachments`;

  private headers(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.tokenStorage.getToken()}` });
  }

  list(caseId: number, context: AttachmentContext): Observable<CaseAttachment[]> {
    const params = new HttpParams().set('caseId', caseId).set('context', context);
    return this.http
      .get<{ data: CaseAttachment[] }>(this.apiUrl, { headers: this.headers(), params })
      .pipe(map((response) => response.data ?? []));
  }

  /** Sube un archivo emitiendo el progreso; cancelar = desuscribirse. */
  upload(params: UploadAttachmentParams): Observable<UploadProgress> {
    const form = new FormData();
    form.append('caseId', String(params.caseId));
    form.append('context', params.context);
    form.append('category', params.category);
    if (params.description?.trim()) form.append('description', params.description.trim());
    if (params.signedAt) form.append('signedAt', params.signedAt);
    form.append('file', params.file, params.file.name);

    return this.http
      .post<{ data: CaseAttachment }>(this.apiUrl, form, {
        headers: this.headers(),
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        map((event: HttpEvent<{ data: CaseAttachment }>): UploadProgress | null => {
          if (event.type === HttpEventType.UploadProgress) {
            return { progress: event.total ? Math.round((100 * event.loaded) / event.total) : 0 };
          }
          if (event.type === HttpEventType.Response && event.body) {
            return { done: event.body.data };
          }
          return null;
        }),
        filter((value): value is UploadProgress => value !== null),
      );
  }

  /** Pide una URL prefirmada de corta duración y la abre para descargar */
  getDownloadUrl(id: number): Observable<{ url: string; fileName: string; expiresInSeconds: number }> {
    return this.http
      .get<{ data: { url: string; fileName: string; expiresInSeconds: number } }>(`${this.apiUrl}/${id}/download`, {
        headers: this.headers(),
      })
      .pipe(map((response) => response.data));
  }

  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.headers() });
  }
}
