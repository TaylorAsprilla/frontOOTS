import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserAvatarService } from '../../../core/services/user-avatar.service';

/** Foto de un usuario (desde el servidor) o, si no tiene, la imagen por defecto */
@Component({
  selector: 'app-user-avatar',
  standalone: true,
  template: `<img [src]="src" [alt]="alt" [class]="imgClass" [attr.style]="imgStyle" />`,
})
export class UserAvatarComponent implements OnChanges, OnDestroy {
  @Input() userId?: number;
  @Input() hasAvatar = false;
  /** Fecha del último cambio de foto: cambia cuando el usuario sube otra */
  @Input() version?: string | null;
  @Input() fallback = 'assets/images/users/avatar-1.jpg';
  @Input() alt = 'Usuario';
  @Input() imgClass = 'rounded-circle';
  @Input() imgStyle: string | null = null;

  src = this.fallback;
  private subscription?: Subscription;

  constructor(private readonly avatars: UserAvatarService) {}

  ngOnChanges(): void {
    this.subscription?.unsubscribe();
    this.src = this.fallback;
    if (!this.hasAvatar || this.userId == null) return;
    this.subscription = this.avatars.url(this.userId, this.version).subscribe((url) => {
      this.src = url ?? this.fallback;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
