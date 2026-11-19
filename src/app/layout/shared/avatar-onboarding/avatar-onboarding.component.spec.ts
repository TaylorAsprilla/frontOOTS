import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AuthenticationService } from '../../../core/services/auth.service';
import { ProfileAvatarService } from '../../../core/services/profile-avatar.service';
import { AvatarTourService } from '../../../core/services/avatar-tour.service';
import { AvatarOnboardingComponent } from './avatar-onboarding.component';

describe('AvatarOnboardingComponent', () => {
  const loaded = signal(true);
  const url = signal<string | null>(null);
  const tour = { start: jasmine.createSpy('start') };

  const create = () => {
    TestBed.configureTestingModule({
      imports: [AvatarOnboardingComponent],
      providers: [
        { provide: AuthenticationService, useValue: { currentUser: () => ({ id: 42 }) } },
        { provide: ProfileAvatarService, useValue: { loaded, url } },
        { provide: AvatarTourService, useValue: tour },
      ],
    });
    const fixture = TestBed.createComponent(AvatarOnboardingComponent);
    fixture.detectChanges();
    return fixture;
  };

  beforeEach(() => {
    localStorage.removeItem('oots.avatarTipDismissed.42');
    loaded.set(true);
    url.set(null);
    tour.start.calls.reset();
  });

  it('shows the steps when the user has no photo', () => {
    const fixture = create();
    expect(fixture.nativeElement.textContent).toContain('Cambiar foto');
  });

  it('stays hidden while the photo status is unknown or the user has a photo', () => {
    loaded.set(false);
    expect(create().nativeElement.textContent).not.toContain('Cambiar foto');
    TestBed.resetTestingModule();
    loaded.set(true);
    url.set('blob:foto');
    expect(create().nativeElement.textContent).not.toContain('Cambiar foto');
  });

  it('remembers the dismissal for that user', () => {
    const fixture = create();
    fixture.componentInstance.dismissForever();
    fixture.detectChanges();
    expect(localStorage.getItem('oots.avatarTipDismissed.42')).toBe('1');
    expect(fixture.nativeElement.textContent).not.toContain('Cambiar foto');
  });

  it('"later" hides it only for this session', () => {
    const fixture = create();
    fixture.componentInstance.later();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).not.toContain('Cambiar foto');
    expect(localStorage.getItem('oots.avatarTipDismissed.42')).toBeNull();
  });

  it('starts the guided tour and does not show the notice again', () => {
    const fixture = create();
    fixture.componentInstance.startTour();
    fixture.detectChanges();
    expect(tour.start).toHaveBeenCalled();
    expect(localStorage.getItem('oots.avatarTipDismissed.42')).toBe('1');
  });
});
