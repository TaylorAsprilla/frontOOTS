import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
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
