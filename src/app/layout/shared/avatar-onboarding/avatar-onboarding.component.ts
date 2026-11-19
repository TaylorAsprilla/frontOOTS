import { Component, computed, inject, signal } from '@angular/core';
import { AvatarTourService } from '../../../core/services/avatar-tour.service';
import { AuthenticationService } from '../../../core/services/auth.service';
import { ProfileAvatarService } from '../../../core/services/profile-avatar.service';

const STORAGE_PREFIX = 'oots.avatarTipDismissed.';

/**
 * Aviso con el paso a paso para poner la foto de perfil. Se muestra a quien
 * todavía no tiene foto, hasta que lo cierre con «No mostrar más» o inicie la guía.
 * «Más tarde» solo lo oculta durante la sesión actual.
 */
@Component({
  selector: 'app-avatar-onboarding',
  standalone: true,
  template: `
    @if (visible()) {
      <div class="modal-backdrop fade show"></div>
      <div class="modal fade show d-block" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="avatarTipTitle">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="avatarTipTitle"><i class="mdi mdi-camera me-1"></i>Agrega tu foto de perfil</h5>
              <button type="button" class="btn-close" aria-label="Cerrar" (click)="later()"></button>
            </div>
            <div class="modal-body">
              <p class="text-muted">Tu foto ayuda a tus compañeros a reconocerte. Te mostramos paso a paso dónde cambiarla:</p>
              <ol class="ps-3 mb-0">
                <li class="mb-2">Abre el menú con tu nombre, arriba a la derecha, y elige <strong>Mi cuenta</strong>.</li>
                <li class="mb-2">En tu perfil, pulsa el botón <strong>Cambiar foto</strong>.</li>
                <li>Selecciona una imagen JPG, PNG o WebP: la foto se recorta sola.</li>
              </ol>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-link text-muted" (click)="later()">Más tarde</button>
              <button type="button" class="btn btn-outline-secondary" (click)="dismissForever()">No mostrar más</button>
              <button type="button" class="btn btn-primary" (click)="startTour()">Iniciar guía</button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class AvatarOnboardingComponent {
  private readonly auth = inject(AuthenticationService);
  private readonly avatar = inject(ProfileAvatarService);
  private readonly tour = inject(AvatarTourService);

  private readonly hiddenForSession = signal(false);
  private readonly dismissedVersion = signal(0);

  readonly visible = computed(() => {
    this.dismissedVersion();
    const userId = this.auth.currentUser()?.id;
    return (
      userId != null &&
      this.avatar.loaded() &&
      !this.avatar.url() &&
      !this.hiddenForSession() &&
      !this.isDismissed(userId)
    );
  });

  later(): void {
    this.hiddenForSession.set(true);
  }

  dismissForever(): void {
    const userId = this.auth.currentUser()?.id;
    if (userId != null) {
      try {
        localStorage.setItem(STORAGE_PREFIX + userId, '1');
      } catch {
        /* sin almacenamiento: se oculta solo en esta sesión */
      }
    }
    this.hiddenForSession.set(true);
    this.dismissedVersion.update((v) => v + 1);
  }

  startTour(): void {
    this.dismissForever();
    this.tour.start();
  }

  private isDismissed(userId: number): boolean {
    try {
      return localStorage.getItem(STORAGE_PREFIX + userId) === '1';
    } catch {
      return false;
    }
  }
}
