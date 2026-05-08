import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
  handlePdfError(error: unknown, fallbackMessage = 'No fue posible generar el PDF.'): void {
    let message = fallbackMessage;
    if (error instanceof HttpErrorResponse) {
      if (error.status === 404) {
        message = 'El documento no está disponible.';
      } else if (error.status === 0) {
        message = 'No fue posible conectarse al servidor para generar el PDF.';
      } else if (typeof error.error === 'string' && error.error.trim().length > 0) {
        message = error.error;
      } else if ((error.error as any)?.message) {
        message = (error.error as any).message;
      }
    }
    this.notificationService.showError(message);
  }

  // --- internals ---------------------------------------------------------

  private requestPdf(url: string): Observable<Blob> {
    const token = this.tokenStorageService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      Accept: 'application/pdf',
    });
    return this.http.get(url, { headers, responseType: 'blob' }).pipe(catchError((error) => throwError(() => error)));
  }

  private ensurePdfBlob(blob: Blob): Blob {
    return blob.type === 'application/pdf' ? blob : new Blob([blob], { type: 'application/pdf' });
  }
}
