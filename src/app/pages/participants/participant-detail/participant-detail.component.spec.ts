import { TestBed } from '@angular/core/testing';
import { registerLocaleData } from '@angular/common';
import localeEsCo from '@angular/common/locales/es-CO';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { of } from 'rxjs';
import { ParticipantService } from '../../../core/services/participant.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthenticationService } from '../../../core/services/auth.service';
import { RoleService } from '../../../core/services/role.service';
import { ParticipantDetailComponent } from './participant-detail.component';

describe('Participant detail nullable relations', () => {
  const participant = {
    id: 21,
    firstName: 'Test',
    firstLastName: 'Participant',
    birthDate: '1990-01-01',
    documentType: null,
    gender: null,
    maritalStatus: null,
    healthInsurance: null,
    cases: null,
    emergencyContacts: [{ id: 1, emergencyContact: null, relationship: null }],
    familyMembers: [{ id: 1, name: 'Family member', familyRelationship: null, academicLevel: null }],
    bioPsychosocialHistory: {
      academicLevel: null,
      incomeLevel: null,
      incomeSource: null,
      housingType: null,
    },
  };

  beforeEach(async () => {
    registerLocaleData(localeEsCo);
    await TestBed.configureTestingModule({
      imports: [
        ParticipantDetailComponent,
        TranslocoTestingModule.forRoot({
          langs: { es: {} },
          translocoConfig: { availableLangs: ['es'], defaultLang: 'es' },
          preloadLangs: true,
        }),
      ],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '21' }, data: {} } } },
        { provide: ParticipantService, useValue: { getParticipantById: () => of({ data: participant }) } },
        { provide: NotificationService, useValue: {} },
        { provide: AuthenticationService, useValue: { currentUser: () => null } },
        { provide: RoleService, useValue: {} },
      ],
    }).compileComponents();
  });

  it('renders missing catalogs, contact relations and cases without crashing', () => {
    const fixture = TestBed.createComponent(ParticipantDetailComponent);
    expect(() => fixture.detectChanges()).not.toThrow();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.textContent).toContain('Test');
    expect(element.textContent).toContain('Family member');
    expect(element.querySelectorAll('strong')[0].textContent).toContain('—');
  });
});
