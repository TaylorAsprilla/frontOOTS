import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, defer } from 'rxjs';
import { finalize, shareReplay } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { TokenStorageService } from './token-storage.service';
import { NotificationService } from './notification.service';

/**
 * Service in charge of generating, opening and downloading case-related PDFs.
 *
 * Note: Signatures are intentionally NOT implemented in this phase.
 * The structure is prepared so that signature handling can be added later
 * (e.g. signature canvas, uploaded image, validation) without changing
 * this public API.
 */
@Injectable({ providedIn: 'root' })
export class CasePdfService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorageService = inject(TokenStorageService);
  private readonly notificationService = inject(NotificationService);

  private readonly baseUrl = `${environment.apiUrl}/cases`;
  private readonly inFlight = new Map<string, Observable<Blob>>();

  /** PDF: Culminación del proceso de ayuda */
  getHelpProcessCompletionPdf(caseId: number | string): Observable<Blob> {
    return this.requestPdf(`${this.baseUrl}/${caseId}/documents/help-process-completion/pdf`);
  }

  /** PDF: Plan de intervención */
  getInterventionPlanPdf(caseId: number | string): Observable<Blob> {
    return this.requestPdf(`${this.baseUrl}/${caseId}/documents/intervention-plan/pdf`);
  }

  /** PDF: Nota de progreso individual */
  getProgressNotePdf(caseId: number | string, progressNoteId: number | string): Observable<Blob> {
    return this.requestPdf(`${this.baseUrl}/${caseId}/documents/progress-notes/${progressNoteId}/pdf`);
  }

  /** PDF: Nota de cierre */
  getClosingNotePdf(caseId: number | string): Observable<Blob> {
    return this.requestPdf(`${this.baseUrl}/${caseId}/documents/closing-note/pdf`);
  }

  /** PDF: Caso completo del participante */
  getFullCasePdf(caseId: number | string): Observable<Blob> {
    return this.requestPdf(`${this.baseUrl}/${caseId}/documents/full-case/pdf`);
  }

  /** Open a PDF blob in a new browser tab. */
  openPdf(blob: Blob, fileName: string): void {
    const file = this.ensurePdfBlob(blob);
    const url = URL.createObjectURL(file);
    const win = window.open(url, '_blank');
    if (!win) {
      URL.revokeObjectURL(url);
      // Pop-up blocked: fall back to download
      this.downloadPdf(blob, fileName);
      return;
    }
    // Revoke the URL after a short delay so the new tab has time to load.
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }

  /** Trigger a download of a PDF blob. */
  downloadPdf(blob: Blob, fileName: string): void {
    const file = this.ensurePdfBlob(blob);
    const url = URL.createObjectURL(file);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    setTimeout(() => URL.revokeObjectURL(url), 1_000);
  }

  /** Centralised error handling for PDF requests. */
  async handlePdfError(error: unknown, fallbackMessage = 'No fue posible generar el PDF. Intente nuevamente. Si el problema continúa, contacte al administrador.'): Promise<void> {
    let message = fallbackMessage;
    if (error instanceof HttpErrorResponse) {
      if (error.status === 404) {
        message = 'No se encontró el documento solicitado. Verifique que esté registrado y guardado en el caso.';
      } else if (error.status === 401) {
        message = 'Su sesión expiró o no es válida. Inicie sesión nuevamente para descargar el documento.';
      } else if (error.status === 403) {
        message = 'No tiene permiso para descargar documentos de este caso.';
      } else if (error.status === 409) {
        message = 'No se puede generar el documento con el estado actual del expediente. Contacte al administrador.';
      } else if (error.status === 422) {
        message = 'Complete y guarde la información necesaria del caso antes de descargar este documento.';
      } else if (error.status === 429) {
        message = 'Se han solicitado demasiadas descargas. Espere unos momentos e intente nuevamente.';
      } else if (error.status === 0) {
        message = 'No fue posible conectarse al servidor para generar el PDF.';
      }
      if ([400, 404, 409, 422].includes(error.status)) {
        let body: unknown = error.error;
        if (body instanceof Blob || typeof body === 'string') {
          try {
            body = JSON.parse(body instanceof Blob ? await body.text() : body);
          } catch {
            // Non-JSON responses use the user-facing status message.
            body = undefined;
          }
        }
        if (typeof body === 'object' && body !== null && 'message' in body) {
          const detail = body.message;
          if (typeof detail === 'string' && detail.trim()) {
            message = detail;
          } else if (Array.isArray(detail)) {
            const messages = detail.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
            if (messages.length) message = messages.join(' ');
          }
        }
      }
    }
    this.notificationService.showError(message);
  }

  // --- internals ---------------------------------------------------------

  private requestPdf(url: string): Observable<Blob> {
    return defer(() => {
      const token = this.tokenStorageService.getToken();
      const key = `${token}:${url}`;
      const pending = this.inFlight.get(key);
      if (pending) return pending;
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
        Accept: 'application/pdf',
      });
      const request = this.http.get(url, { headers, responseType: 'blob' }).pipe(
        finalize(() => this.inFlight.delete(key)),
        shareReplay({ bufferSize: 1, refCount: true }),
      );
      this.inFlight.set(key, request);
      return request;
    });
  }

  private ensurePdfBlob(blob: Blob): Blob {
    return blob.type === 'application/pdf' ? blob : new Blob([blob], { type: 'application/pdf' });
  }
}
