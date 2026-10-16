import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { of } from 'rxjs';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { AdminParticipantsService } from '../../../core/services/admin-participants.service';
import { AdminParticipantsListComponent } from './admin-participants-list.component';
import { AdminParticipant } from '../../../core/interfaces/admin-participant.interface';

describe('All participants table', () => {
  const participant: AdminParticipant = {
    id: 987,
    firstName: 'Ana',
    secondName: 'Maria',
    firstLastName: 'Perez',
    secondLastName: 'Lopez',
    documentNumber: '12345678',
    email: 'ana@example.test',
    phoneNumber: '+57 311 8873333',
    casesCount: 3,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AdminParticipantsListComponent,
        TranslocoTestingModule.forRoot({
          langs: { es: {} },
          translocoConfig: { availableLangs: ['es'], defaultLang: 'es' },
          preloadLangs: true,
        }),
      ],
      providers: [
        provideRouter([]),
        { provide: AdminParticipantsService, useValue: { getAllParticipants: () => of({ data: [participant], total: 1 }) } },
      ],
    }).compileComponents();
  });

  it('groups identity, removes the ID column and links contact actions', () => {
    const fixture = TestBed.createComponent(AdminParticipantsListComponent);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    const cells = element.querySelectorAll('tbody tr td');
    expect(cells[0].textContent).toContain('Ana Maria Perez Lopez');
    expect(cells[0].textContent).toContain('12345678');
    expect(cells[0].querySelector('a[href="mailto:ana%40example.test"]')).not.toBeNull();
    expect(cells[1].querySelector('a[href="https://wa.me/573118873333"]')).not.toBeNull();
    expect(cells[1].querySelector('a[href="https://t.me/+573118873333"]')).not.toBeNull();
    expect(cells[2].textContent?.trim()).toBe('3');
    expect(cells.length).toBe(7);
    expect(element.querySelectorAll('thead th').length).toBe(7);
    expect(element.querySelector('thead')?.textContent).not.toContain('adminParticipants.assignedUserStatus');
    expect(element.querySelector('thead')?.textContent).not.toContain('#');
  });

  it('normalizes national numbers only when the participant country is known', () => {
    const fixture = TestBed.createComponent(AdminParticipantsListComponent);
    const component = fixture.componentInstance;
    expect(component.getMessagingPhone({ ...participant, phoneNumber: '3118873333', country: { iso: 'CO' } })).toBe('573118873333');
    expect(component.getMessagingPhone({ ...participant, phoneNumber: '3118873333' })).toBeNull();
    expect(component.getMessagingPhone({ ...participant, phoneNumber: 'invalid' })).toBeNull();
    expect(component.getMessagingPhone({ ...participant, phoneNumber: '+1 202 555 0123', country: null })).toBe('12025550123');
  });

  it('renders the styled messaging tooltip outside the responsive table', fakeAsync(() => {
    const fixture = TestBed.createComponent(AdminParticipantsListComponent);
    fixture.detectChanges();
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a[href^="https://t.me/"]');
    link.dispatchEvent(new Event('mouseenter'));
    fixture.detectChanges();
    tick(200);
    const tooltip = document.body.querySelector('.participant-contact-tooltip');
    expect(tooltip).not.toBeNull();
    expect(tooltip?.parentElement).toBe(document.body);
    expect(tooltip?.querySelector('strong')?.textContent).toBe('Telegram');
    link.dispatchEvent(new Event('mouseleave'));
    tick(200);
    fixture.destroy();
  }));

  it('does not hide unexpected phone library errors', () => {
    const fixture = TestBed.createComponent(AdminParticipantsListComponent);
    const phoneUtil = PhoneNumberUtil.getInstance();
    spyOn(phoneUtil, 'parseAndKeepRawInput').and.throwError('Unexpected failure');
    expect(() => fixture.componentInstance.getMessagingPhone(participant)).toThrowError('Unexpected failure');
  });

  it('disables messaging for missing numbers and displays zero cases correctly', () => {
    const fixture = TestBed.createComponent(AdminParticipantsListComponent);
    fixture.detectChanges();
    fixture.componentInstance.pageItems = [{ ...participant, phoneNumber: null, email: null, casesCount: 0 }];
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelectorAll('tbody button:disabled').length).toBe(2);
    expect(element.querySelector('a[href^="mailto:"]')).toBeNull();
    expect(element.querySelectorAll('tbody td')[2].textContent?.trim()).toBe('0');
  });
});
