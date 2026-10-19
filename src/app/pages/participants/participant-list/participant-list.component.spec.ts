import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { of } from 'rxjs';
import { ParticipantListComponent } from './participant-list.component';
import { ParticipantService } from '../../../core/services/participant.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthenticationService } from '../../../core/services/auth.service';
import { RoleService } from '../../../core/services/role.service';

describe('Social work participant table', () => {
  const participant = {
    id: 12, firstName: 'Ana', secondName: 'Maria', firstLastName: 'Perez',
    documentNumber: '12345', email: 'ana@example.test', phoneNumber: '3118873333',
    country: { iso: 'CO' }, city: 'Bogota', state: 'DC', casesCount: 3,
    registeredBy: { id: 7, firstName: 'Sara', firstLastName: 'Diaz', email: 'sara@example.test' },
  };
  const service = {
    getParticipantsByUser: jasmine.createSpy().and.returnValue(of({ data: { participants: [participant] } })),
    getParticipantsByCountry: jasmine.createSpy(),
  };
  const roleService = { isAdminCountry: () => false, hasAnyRole: () => true };

  beforeEach(async () => {
    service.getParticipantsByUser.calls.reset();
    service.getParticipantsByCountry.calls.reset();
    await TestBed.configureTestingModule({
      imports: [
        ParticipantListComponent,
        TranslocoTestingModule.forRoot({
          langs: { es: {} },
          translocoConfig: { availableLangs: ['es'], defaultLang: 'es' }, preloadLangs: true,
        }),
      ],
      providers: [
        provideRouter([]),
        { provide: ParticipantService, useValue: service },
        { provide: NotificationService, useValue: {} },
        { provide: AuthenticationService, useValue: { currentUser: () => ({ id: 7 }) } },
        { provide: RoleService, useValue: roleService },
      ],
    }).compileComponents();
  });

  it('matches administrative columns, identity, contacts, counts and assignment using the user endpoint', () => {
    const fixture = TestBed.createComponent(ParticipantListComponent);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    const headers = Array.from(element.querySelectorAll('thead th')).map((th) => th.textContent?.trim());
    expect(headers).toEqual([
      'participants.fullName', 'adminParticipants.contact', 'adminParticipants.casesCount',
      'adminParticipants.location', 'adminParticipants.assignedTo', 'participants.createdAt', 'app.actions',
    ]);
    expect(element.querySelector('.participant-identity')?.textContent).toContain('Ana Maria Perez');
    expect(element.querySelector('.participant-identity')?.textContent).toContain('12345');
    expect(element.querySelector('a[href="mailto:ana%40example.test"]')).not.toBeNull();
    expect(element.querySelector('a[href="https://wa.me/573118873333"]')).not.toBeNull();
    expect(element.querySelector('a[href="https://t.me/+573118873333"]')).not.toBeNull();
    expect(element.querySelectorAll('tbody td')[2].textContent?.trim()).toBe('3');
    expect(element.querySelector('.assigned-user')?.textContent).toContain('Sara Diaz');
    expect(service.getParticipantsByUser).toHaveBeenCalledWith(7);
    expect(service.getParticipantsByCountry).not.toHaveBeenCalled();
    expect(element.querySelector('a[href="/participants/edit/12"]')).not.toBeNull();
    expect(element.querySelector('a[href="/cases/create/12"]')).not.toBeNull();
    const navigate = spyOn(TestBed.inject(Router), 'navigate');
    const whatsapp = element.querySelector('a[href^="https://wa.me"]');
    whatsapp?.addEventListener('click', (event) => event.preventDefault());
    whatsapp?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    expect(navigate).not.toHaveBeenCalled();
  });

  it('handles absent contact and assigned user and preserves edit/create permissions', () => {
    spyOn(roleService, 'hasAnyRole').and.returnValue(false);
    const fixture = TestBed.createComponent(ParticipantListComponent);
    fixture.detectChanges();
    fixture.componentInstance.filteredParticipants = [{
      ...fixture.componentInstance.filteredParticipants[0],
      email: '', phoneNumber: '', casesCount: 0, registeredBy: null,
    }];
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelectorAll('tbody button:disabled').length).toBe(2);
    expect(element.querySelector('a[href^="mailto:"]')).toBeNull();
    expect(element.querySelectorAll('tbody td')[2].textContent?.trim()).toBe('0');
    expect(element.querySelector('a[href="/participants/edit/12"]')).toBeNull();
    expect(element.querySelector('a[href="/cases/create/12"]')).toBeNull();
    expect(element.querySelector('.assigned-user-empty')).not.toBeNull();
  });

  it('searches full names and assigned professionals without changing scope', fakeAsync(() => {
    const fixture = TestBed.createComponent(ParticipantListComponent);
    fixture.detectChanges();
    for (const searchTerm of ['Ana Maria', 'Sara', 'sara@example.test', '12345']) {
      fixture.componentInstance.searchForm.patchValue({ searchTerm });
      tick(300);
      expect(fixture.componentInstance.filteredParticipants.map((item) => item.id)).toEqual([12]);
    }
    fixture.destroy();
  }));

  it('loads the assigned country across professionals for ADMIN_COUNTRY', () => {
    spyOn(roleService, 'isAdminCountry').and.returnValue(true);
    const auth = TestBed.inject(AuthenticationService);
    const user = auth.currentUser();
    if (!user) throw new Error('Expected an authenticated test user');
    spyOn(auth, 'currentUser').and.returnValue({
      ...user, country: { id: 3, name: 'USA', iso: 'US', locale: 'en-US' },
    });
    service.getParticipantsByCountry.and.returnValue(of({
      data: { participants: [participant, { ...participant, id: 13, registeredBy: { id: 8 } }] },
    }));
    const fixture = TestBed.createComponent(ParticipantListComponent);
    fixture.detectChanges();
    expect(service.getParticipantsByCountry).toHaveBeenCalledOnceWith(3);
    expect(service.getParticipantsByUser).not.toHaveBeenCalled();
    expect(fixture.componentInstance.participants.map((item) => item.id)).toEqual([12, 13]);
    fixture.destroy();
  });
});
