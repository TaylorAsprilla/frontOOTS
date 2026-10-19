import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { ParticipantService } from './participant.service';
import { TokenStorageService } from './token-storage.service';
import { NotificationService } from './notification.service';
import { CreateParticipantDto } from '../interfaces/participant-create.interface';
import { ParticipantDetailComponent } from '../../pages/participants/participant-detail/participant-detail.component';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from './auth.service';
import { RoleService } from './role.service';
import { CaseService } from './case.service';

describe('ParticipantService update payload', () => {
  let service: ParticipantService;
  let http: HttpTestingController;

  const participantData: CreateParticipantDto = {
    firstName: 'Participante 3',
    firstLastName: 'Apellido 3',
    phoneNumber: '+57 311 8873333',
    address: 'Transversal 39 # 38A - 39 Sur',
    city: 'Bogota',
    birthDate: '2008-01-11',
    genderId: 1,
    maritalStatusId: 2,
    healthInsuranceId: 10,
    countryId: 1,
    registeredById: 1,
    emergencyContacts: [],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ParticipantService,
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '21' }, data: {} } } },
        { provide: AuthenticationService, useValue: {} },
        { provide: RoleService, useValue: {} },
        { provide: TokenStorageService, useValue: { getToken: () => 'test-token' } },
        {
          provide: NotificationService,
          useValue: jasmine.createSpyObj('NotificationService', ['showSuccess', 'showError']),
        },
      ],
    });
    service = TestBed.inject(ParticipantService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('shows a single readable notification when participant details fail to load', () => {
    const component = TestBed.runInInjectionContext(() => new ParticipantDetailComponent());
    component.ngOnInit();
    http.expectOne(`${environment.apiUrl}/participants/21`).flush({}, { status: 500, statusText: 'Server Error' });
    expect(TestBed.inject(NotificationService).showError).toHaveBeenCalledOnceWith(
      'No se pudo cargar la información del participante. Verifique su conexión y vuelva a intentarlo.',
    );
    expect(component.isLoading).toBeFalse();
    component.ngOnDestroy();
  });

  it('confirms participant deletion in Spanish', () => {
    service.deleteParticipant(21).subscribe();
    http.expectOne(`${environment.apiUrl}/participants/21`).flush({ success: true });
    expect(TestBed.inject(NotificationService).showSuccess).toHaveBeenCalledOnceWith(
      'Participante eliminado correctamente.',
    );
  });

  it('loads country case summaries using the country endpoint', () => {
    const countryCases = { countryId: 3, total: 2, cases: [{ id: 41 }, { id: 42 }] };
    TestBed.inject(CaseService).getCasesByCountry(3).subscribe((response) => {
      expect(response.countryId).toBe(3);
      expect(response.total).toBe(2);
      expect(response.cases.map((item) => item.id)).toEqual([41, 42]);
    });
    const request = http.expectOne(`${environment.apiUrl}/cases/by-country/3`);
    expect(request.request.method).toBe('GET');
    expect(request.request.headers.get('Authorization')).toBe('Bearer test-token');
    request.flush({ data: countryCases });
  });

  it('omits registeredById from PATCH while preserving the editable fields and input', () => {
    service.updateParticipant(21, participantData).subscribe();

    const request = http.expectOne(`${environment.apiUrl}/participants/21`);
    expect(request.request.method).toBe('PATCH');
    const { registeredById, ...expectedPayload } = participantData;
    expect(request.request.body).toEqual(expectedPayload);
    expect(participantData.registeredById).toBe(registeredById);
    request.flush({ data: { id: 21 } });
  });

  it('also omits registeredById from complete updates', () => {
    service.updateParticipantComplete(21, participantData).subscribe();

    const request = http.expectOne(`${environment.apiUrl}/participants/21`);
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body.registeredById).toBeUndefined();
    expect(request.request.body.firstName).toBe(participantData.firstName);
    request.flush({ data: { id: 21 } });
  });

  it('sends null for optional names that are intentionally cleared', () => {
    service
      .updateParticipant(21, {
        secondName: null,
        secondLastName: null,
      })
      .subscribe();

    const request = http.expectOne(`${environment.apiUrl}/participants/21`);
    expect(request.request.body).toEqual({
      secondName: null,
      secondLastName: null,
    });
    request.flush({ data: { id: 21 } });
  });

  it('preserves the registration field when creating a participant', () => {
    service.createParticipant(participantData).subscribe();

    const request = http.expectOne(`${environment.apiUrl}/participants`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(participantData);
    request.flush({ data: { id: 21 } });
  });
});
