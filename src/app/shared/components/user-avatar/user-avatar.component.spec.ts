import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { UserAvatarService } from '../../../core/services/user-avatar.service';
import { UserAvatarComponent } from './user-avatar.component';

describe('UserAvatarComponent', () => {
  const url = jasmine.createSpy('url');

  const create = (inputs: Partial<UserAvatarComponent>) => {
    TestBed.configureTestingModule({
      imports: [UserAvatarComponent],
      providers: [{ provide: UserAvatarService, useValue: { url } }],
    });
    const fixture = TestBed.createComponent(UserAvatarComponent);
    Object.assign(fixture.componentInstance, { fallback: 'fallback.png', ...inputs });
    fixture.componentInstance.ngOnChanges();
    fixture.detectChanges();
    return fixture.nativeElement.querySelector('img') as HTMLImageElement;
  };

  beforeEach(() => url.calls.reset());

  it('shows the default image when the user has no photo (and does not download)', () => {
    const img = create({ userId: 5, hasAvatar: false });
    expect(img.getAttribute('src')).toBe('fallback.png');
    expect(url).not.toHaveBeenCalled();
  });

  it('shows the downloaded photo, keyed by the last change date', () => {
    url.and.returnValue(of('blob:foto'));
    const img = create({ userId: 5, hasAvatar: true, version: '2026-01-01T00:00:00Z' });
    expect(url).toHaveBeenCalledWith(5, '2026-01-01T00:00:00Z');
    expect(img.getAttribute('src')).toBe('blob:foto');
  });

  it('falls back to the default image when the download fails', () => {
    url.and.returnValue(of(null));
    expect(create({ userId: 5, hasAvatar: true }).getAttribute('src')).toBe('fallback.png');
  });
});
