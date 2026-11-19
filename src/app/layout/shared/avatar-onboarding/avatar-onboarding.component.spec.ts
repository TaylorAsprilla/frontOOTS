import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AuthenticationService } from '../../../core/services/auth.service';
import { AvatarTourService } from '../../../core/services/avatar-tour.service';
import { ProfileAvatarService } from '../../../core/services/profile-avatar.service';
import { AvatarOnboardingComponent } from './avatar-onboarding.component';

describe('AvatarOnboardingComponent', () => {
  const loaded = signal(true);
  const url = signal<string | null>(null);
  const tourSeen = signal(false);
  const tour = { start: jasmine.createSpy('start') };
  const markTourSeen = jasmine.createSpy('markTourSeen').and.callFake(() => tourSeen.set(true));

  const create = () => {
    TestBed.configureTestingModule({
      imports: [AvatarOnboardingComponent],
      providers: [
        { provide: AuthenticationService, useValue: { currentUser: () => ({ id: 42 }) } },
        { provide: ProfileAvatarService, useValue: { loaded, url, tourSeen, markTourSeen } },
        { provide: AvatarTourService, useValue: tour },
      ],
    });
    const fixture = TestBed.createComponent(AvatarOnboardingComponent);
    fixture.detectChanges();
    return fixture;
  };

  const shown = (fixture: { nativeElement: HTMLElement }) => fixture.nativeElement.textContent!.includes('Cambiar foto');

  beforeEach(() => {
    loaded.set(true);
    url.set(null);
    tourSeen.set(false);
    tour.start.calls.reset();
    markTourSeen.calls.reset();
  });

  it('shows the steps to a user without photo who has not seen the guide', () => {
    expect(shown(create())).toBeTrue();
  });

  it('stays hidden while status is unknown, with a photo, or once the guide was seen', () => {
    loaded.set(false);
    expect(shown(create())).toBeFalse();
    TestBed.resetTestingModule();
    loaded.set(true);
    url.set('blob:foto');
    expect(shown(create())).toBeFalse();
    TestBed.resetTestingModule();
    url.set(null);
    tourSeen.set(true);
    expect(shown(create())).toBeFalse();
  });

  it('"Ahora no" saves in the database that it was seen and closes', () => {
    const fixture = create();
    fixture.componentInstance.skip();
    fixture.detectChanges();
    expect(markTourSeen).toHaveBeenCalledTimes(1);
    expect(tour.start).not.toHaveBeenCalled();
    expect(shown(fixture)).toBeFalse();
  });

  it('starts the guided tour and records it as seen', () => {
    const fixture = create();
    fixture.componentInstance.startTour();
    fixture.detectChanges();
    expect(tour.start).toHaveBeenCalled();
    expect(markTourSeen).toHaveBeenCalledTimes(1);
    expect(shown(fixture)).toBeFalse();
  });
});
