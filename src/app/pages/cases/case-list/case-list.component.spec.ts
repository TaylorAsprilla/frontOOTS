import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { of } from 'rxjs';
import { registerLocaleData } from '@angular/common';
import localeEsCo from '@angular/common/locales/es-CO';
import { CaseListComponent } from './case-list.component';
import { CaseService } from '../../../core/services/case.service';
import { CasePdfService } from '../../../core/services/case-pdf.service';
import { TokenStorageService } from '../../../core/services/token-storage.service';
import { NotificationService } from '../../../core/services/notification.service';
import { RoleService } from '../../../core/services/role.service';
import { CountryService } from '../../../core/services/country.service';
import { CaseStatus } from '../../../core/interfaces/case.interface';

describe('Social work case list', () => {
  beforeEach(async () => {
    registerLocaleData(localeEsCo);
    await TestBed.configureTestingModule({
      imports: [
        CaseListComponent,
        TranslocoTestingModule.forRoot({
          langs: {
            es: {
              cases: {
                caseNumber: '# Caso', status: 'Estado',
                open: 'Abierto', closed: 'Cerrado', inProgress: 'En Progreso',
              },
            },
          },
          translocoConfig: { availableLangs: ['es'], defaultLang: 'es' },
          preloadLangs: true,
        }),
      ],
      providers: [
        provideRouter([]),
        {
          provide: CaseService,
          useValue: {
            getCasesByUserId: () => of({
              cases: [
                {
                  id: 36, caseNumber: 'LEGACY-A', status: CaseStatus.OPEN,
                  participant: { fullName: 'Ana Perez', documentNumber: '12345', city: 'Bogota', state: 'DC' },
                  createdBy: { firstName: 'Sara', firstLastName: 'Diaz', email: 'sara@example.test', status: 'ACTIVE' },
                  intervention: 'Intervencion inicial',
                  createdAt: '2026-10-16T12:00:00',
                  consultationReason: 'Motivo detallado de consulta '.repeat(12),
                  followUpPlans: [{ orientationAppointment: true, appointmentDate: new Date().toISOString() }],
                },
                { id: 37, status: CaseStatus.CLOSED },
                { id: 38, status: CaseStatus.IN_PROGRESS },
              ],
            }),
          },
        },
        { provide: CasePdfService, useValue: {} },
        { provide: TokenStorageService, useValue: { getUser: () => ({ id: 10 }) } },
        { provide: NotificationService, useValue: {} },
        { provide: RoleService, useValue: { hasAnyRole: () => true, isAdminCountry: () => false } },
        { provide: CountryService, useValue: { getAvailableCountries: () => [] } },
      ],
    }).compileComponents();
  });

  it('groups the ID, status and appointment alert and preserves case actions', () => {
    const fixture = TestBed.createComponent(CaseListComponent);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('table')?.classList.contains('table-nowrap')).toBeTrue();
    expect(element.querySelector('thead')?.classList.contains('bg-light')).toBeTrue();
    expect(element.querySelector('.entity-cell')?.textContent).toContain('12345');
    expect(element.querySelector('.entity-cell')?.textContent).toContain('Bogota / DC');
    expect(element.querySelectorAll('thead th').length).toBe(7);
    expect(element.querySelector('thead')?.textContent).not.toContain('adminCases.professional');
    expect(Array.from(element.querySelectorAll('thead th')).some((th) => th.textContent?.trim() === 'Estado')).toBeFalse();
    const identities = element.querySelectorAll('.case-identity');
    expect(identities[0].parentElement?.querySelector('.case-created-at')?.textContent).toContain('16/10/2026');
    expect(identities[1].parentElement?.querySelector('.case-created-at')?.textContent).toContain('—');
    ['#36', '#37', '#38'].forEach((id, index) => {
      expect(identities[index].querySelector('strong')?.textContent).toBe(id);
    });
    ['Abierto', 'Cerrado', 'En Progreso'].forEach((status, index) => {
      expect(identities[index].querySelector('.badge')?.textContent?.trim()).toBe(status);
    });
    ['bg-info', 'bg-success', 'bg-warning'].forEach((color, index) => {
      expect(identities[index].querySelector('.badge')?.classList.contains(color)).toBeTrue();
    });
    expect(identities[0].querySelector('.mdi-calendar-clock')).not.toBeNull();
    expect(element.querySelector('a[href="/cases/detail/36"]')).not.toBeNull();
    expect(element.querySelector('a[href="/cases/edit/36"]')).not.toBeNull();
    expect(element.querySelector('a[href="/cases/edit/37"]')).toBeNull();
    const reason = element.querySelector<HTMLElement>('.reason-cell');
    expect(reason?.textContent?.trim()).toBe('Motivo detallado de consulta '.repeat(12).trim());
    expect(getComputedStyle(reason!).whiteSpace).toBe('normal');
    expect(parseFloat(getComputedStyle(reason!).minWidth)).toBeGreaterThanOrEqual(320);
    fixture.componentInstance.toggleExpand(fixture.componentInstance.filteredCases[0]);
    fixture.detectChanges();
    expect(element.querySelector('.case-extra-row td[colspan]')?.getAttribute('colspan')).toBe('6');
    expect(element.querySelector('.case-extra-row')?.textContent).toContain('Intervencion inicial');
    fixture.componentInstance.toggleExpand(fixture.componentInstance.filteredCases[0]);
    fixture.detectChanges();
    expect(element.querySelector('.case-extra-row')).toBeNull();
  });

  it('searches by displayed ID and preserves state filtering and ID sorting', fakeAsync(() => {
    const fixture = TestBed.createComponent(CaseListComponent);
    fixture.detectChanges();
    for (const term of ['36', '#36', 'LEGACY-A', 'Ana', 'Sara', '12345']) {
      fixture.componentInstance.searchForm.patchValue({ searchTerm: term });
      tick(300);
      expect(fixture.componentInstance.filteredCases.map((item) => item.id)).toEqual([36]);
    }
    fixture.componentInstance.searchForm.patchValue({ searchTerm: '' });
    tick(300);
    fixture.componentInstance.onStatusFilterChange(CaseStatus.CLOSED);
    expect(fixture.componentInstance.filteredCases.map((item) => item.id)).toEqual([37]);
    fixture.componentInstance.onStatusFilterChange('all');
    fixture.componentInstance.sortBy('id');
    fixture.componentInstance.sortBy('id');
    expect(fixture.componentInstance.filteredCases.map((item) => item.id)).toEqual([38, 37, 36]);
    fixture.destroy();
  }));

  it('loads all cases in the assigned country instead of cases created by the administrator', () => {
    spyOn(TestBed.inject(RoleService), 'isAdminCountry').and.returnValue(true);
    spyOn(TestBed.inject(TokenStorageService), 'getUser').and.returnValue({
      id: 10,
      firstName: 'Admin', firstLastName: 'Country', email: 'admin@example.test',
      country: { id: 3, name: 'USA', iso: 'US', locale: 'en-US' },
      token: 'test-token', tokenType: 'Bearer', expiresAt: new Date(),
    });
    const service = TestBed.inject(CaseService);
    const byUser = spyOn(service, 'getCasesByUserId');
    const byCountry = jasmine.createSpy().and.returnValue(of({
      countryId: 3,
      total: 2,
      cases: [{ id: 41, createdById: 7 }, { id: 42, createdById: 8 }],
    }));
    service.getCasesByCountry = byCountry;
    const fixture = TestBed.createComponent(CaseListComponent);
    fixture.detectChanges();
    expect(byCountry).toHaveBeenCalledOnceWith(3);
    expect(byUser).not.toHaveBeenCalled();
    expect(fixture.componentInstance.totalItems).toBe(2);
    expect(fixture.nativeElement.querySelector('a[href="/cases/edit/41"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('a[href="/cases/detail/41"]')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('tbody .mdi-delete')).toBeNull();
    fixture.destroy();
  });
});
