import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { of } from 'rxjs';
import { registerLocaleData } from '@angular/common';
import localeEsCo from '@angular/common/locales/es-CO';
import { AdminCasesListComponent } from './admin-cases-list.component';
import { AdminCasesService } from '../../../core/services/admin-cases.service';
import { CaseService } from '../../../core/services/case.service';
import { UserService } from '../../../core/services/user.service';
import { NotificationService } from '../../../core/services/notification.service';
import { RoleService } from '../../../core/services/role.service';
import { CountryService } from '../../../core/services/country.service';

describe('All cases table', () => {
  beforeEach(async () => {
    registerLocaleData(localeEsCo);
    await TestBed.configureTestingModule({
      imports: [
        AdminCasesListComponent,
        TranslocoTestingModule.forRoot({
          langs: {
            es: {
              adminCases: {
                caseNumber: '# Caso',
                status: { label: 'Estado', open: 'Abierto', closed: 'Cerrado', inProgress: 'En Progreso' },
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
          provide: AdminCasesService,
          useValue: {
            getAllCases: () => of({
              data: [
                { id: 36, caseNumber: 'LEGACY-A', status: 'open', createdAt: '2026-10-16T12:00:00', consultationReason: 'Motivo completo de consulta '.repeat(12) },
                { id: 37, status: 'closed' },
                { id: 38, status: 'in_progress' },
              ],
              total: 3,
            }),
          },
        },
        { provide: CaseService, useValue: {} },
        { provide: UserService, useValue: {} },
        { provide: NotificationService, useValue: {} },
        { provide: RoleService, useValue: { canTransferCases: () => false } },
        { provide: CountryService, useValue: { getAvailableCountries: () => [] } },
      ],
    }).compileComponents();
  });

  it('displays the case ID beside its status without a separate status column', () => {
    const fixture = TestBed.createComponent(AdminCasesListComponent);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    const headers = Array.from(element.querySelectorAll('thead th'));
    expect(headers.length).toBe(8);
    expect(headers.some((header) => header.textContent?.trim() === 'adminCases.createdAt')).toBeFalse();
    expect(headers.some((header) => header.textContent?.trim() === 'Estado')).toBeFalse();
    const identities = element.querySelectorAll('.case-identity');
    ['#36', '#37', '#38'].forEach((id, index) => {
      expect(identities[index].querySelector('strong')?.textContent).toBe(id);
    });
    ['Abierto', 'Cerrado', 'En Progreso'].forEach((status, index) => {
      expect(identities[index].querySelector('.badge')?.textContent?.trim()).toBe(status);
    });
    expect(identities[0].textContent).not.toContain('LEGACY-A');
    expect(identities[0].parentElement?.querySelector('.case-created-at')?.textContent).toContain('16/10/2026');
    expect(identities[1].parentElement?.querySelector('.case-created-at')?.textContent).toContain('—');
    const reason = element.querySelector<HTMLElement>('.reason-cell');
    expect(reason?.textContent?.trim()).toBe('Motivo completo de consulta '.repeat(12).trim());
    expect(getComputedStyle(reason!).whiteSpace).toBe('normal');
    expect(parseFloat(getComputedStyle(reason!).minWidth)).toBeGreaterThanOrEqual(320);
    fixture.componentInstance.toggleExpand(fixture.componentInstance.pageItems[0]);
    fixture.detectChanges();
    expect(element.querySelector('.case-extra-row td[colspan]')?.getAttribute('colspan')).toBe('7');
  });

  it('finds cases by their displayed ID and preserves legacy number searches', fakeAsync(() => {
    const fixture = TestBed.createComponent(AdminCasesListComponent);
    fixture.detectChanges();
    for (const term of ['36', '#36', 'LEGACY-A']) {
      fixture.componentInstance.searchForm.patchValue({ searchTerm: term });
      tick(300);
      expect(fixture.componentInstance.pageItems.map((item) => item.id)).toEqual([36]);
    }
    fixture.destroy();
  }));
});
