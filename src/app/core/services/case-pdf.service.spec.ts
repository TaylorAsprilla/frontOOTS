import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CasePdfService } from './case-pdf.service';
import { TokenStorageService } from './token-storage.service';
import { NotificationService } from './notification.service';
import { environment } from '../../../environments/environment';

describe('CasePdfService on-demand downloads', () => {
  let service: CasePdfService;
  let http: HttpTestingController;
  let notifications: jasmine.SpyObj<NotificationService>;
  const url = `${environment.apiUrl}/cases/21/documents/full-case/pdf`;

  beforeEach(() => {
    notifications = jasmine.createSpyObj<NotificationService>('NotificationService', ['showError']);
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: TokenStorageService, useValue: { getToken: () => 'test-token' } },
        { provide: NotificationService, useValue: notifications },
      ],
    });
    service = TestBed.inject(CasePdfService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('shows the actionable closing-note message from a JSON blob response', async () => {
    const message = 'Aún no puede descargar la nota de cierre. Registre y guarde la nota en la sección «Nota de cierre» del caso y vuelva a intentarlo.';
    await service.handlePdfError(new HttpErrorResponse({
      status: 404,
      error: new Blob([JSON.stringify({ message: [message] })], { type: 'application/json' }),
    }));
    expect(notifications.showError).toHaveBeenCalledOnceWith(message);
  });

  it('uses a clear fallback when the server response is not JSON', async () => {
    await service.handlePdfError(new HttpErrorResponse({
      status: 404,
      error: new Blob(['Not found'], { type: 'text/plain' }),
    }));
    expect(notifications.showError).toHaveBeenCalledOnceWith(
      'No se encontró el documento solicitado. Verifique que esté registrado y guardado en el caso.',
    );
  });

  it('does not expose internal server errors to the user', async () => {
    await service.handlePdfError(new HttpErrorResponse({
      status: 500,
      error: { message: 'Internal database error' },
    }));
    expect(notifications.showError).toHaveBeenCalledOnceWith(
      'No fue posible generar el PDF. Intente nuevamente. Si el problema continúa, contacte al administrador.',
    );
  });

  it('shares only in-flight downloads and requests a fresh PDF after completion', () => {
    const results: Blob[] = [];
    service.getFullCasePdf(21).subscribe((blob) => results.push(blob));
    service.getFullCasePdf(21).subscribe((blob) => results.push(blob));
    const request = http.expectOne(url);
    expect(request.request.responseType).toBe('blob');
    expect(request.request.headers.get('Authorization')).toBe('Bearer test-token');
    const blob = new Blob(['%PDF-test'], { type: 'application/pdf' });
    request.flush(blob);
    expect(results).toEqual([blob, blob]);
    service.getFullCasePdf(21).subscribe();
    http.expectOne(url).flush(blob);
  });

  it('releases the download lock after an error so the user can retry', () => {
    service.getFullCasePdf(21).subscribe({ error: (error) => service.handlePdfError(error) });
    http.expectOne(url).flush(new Blob(), { status: 403, statusText: 'Forbidden' });
    expect(notifications.showError).toHaveBeenCalledWith('No tiene permiso para descargar documentos de este caso.');
    service.getFullCasePdf(21).subscribe();
    http.expectOne(url).flush(new Blob(['%PDF-test']));
  });

  it('releases cancelled requests instead of retaining a PDF cache', () => {
    const subscription = service.getFullCasePdf(21).subscribe();
    const request = http.expectOne(url);
    subscription.unsubscribe();
    expect(request.cancelled).toBeTrue();
    service.getFullCasePdf(21).subscribe();
    http.expectOne(url).flush(new Blob(['%PDF-test']));
  });
});
