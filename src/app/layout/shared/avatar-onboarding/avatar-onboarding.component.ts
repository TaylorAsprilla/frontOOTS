import { Component, computed, inject, signal } from '@angular/core';
import { AuthenticationService } from '../../../core/services/auth.service';
import { AvatarTourService } from '../../../core/services/avatar-tour.service';
import { ProfileAvatarService } from '../../../core/services/profile-avatar.service';

/**
 * Bienvenida con la guía para poner la foto de perfil. Aparece una sola vez por
 * usuario: al cerrarla (con cualquier botón) se guarda en la base de datos que
 * ya la vio, así que no vuelve a salir en ningún equipo ni navegador.
 * Quien tenga ya una foto no la ve.
 */
@Component({
  selector: 'app-avatar-onboarding',
  standalone: true,
  styles: [
    `
      .tip-icon {
        width: 64px;
        height: 64px;
        margin: 0 auto 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        font-size: 30px;
        color: #fff;
        background: linear-gradient(135deg, var(--bs-primary, #2f3e5c), #6d83b3);
        box-shadow: 0 6px 16px rgba(47, 62, 92, 0.3);
      }
      .tip-step {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 8px 0;
      }
      .tip-step + .tip-step {
        border-top: 1px dashed rgba(0, 0, 0, 0.1);
      }
      .tip-num {
        flex: 0 0 26px;
        height: 26px;
        border-radius: 50%;
        font-size: 13px;
        font-weight: 700;
        line-height: 26px;
        text-align: center;
        color: var(--bs-primary, #2f3e5c);
        background: rgba(47, 62, 92, 0.12);
      }
    `,
  ],
  template: `
    @if (visible()) {
      <div class="modal-backdrop fade show"></div>
      <div class="modal fade show d-block" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="avatarTipTitle">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow-lg" style="border-radius: 16px; overflow: hidden">
            <div class="modal-body px-4 pt-4 pb-3">
              <div class="tip-icon"><i class="mdi mdi-camera"></i></div>
              <h5 class="text-center fw-bold mb-1" id="avatarTipTitle">¡Bienvenido! Agrega tu foto de perfil</h5>
              <p class="text-center text-muted mb-3">
                Ayuda a tus compañeros a reconocerte. Te guiamos en 3 pasos:
              </p>
              <div class="tip-step">
                <span class="tip-num">1</span>
                <span>Abre el menú con tu nombre, arriba a la derecha, y elige <strong>Mi cuenta</strong>.</span>
              </div>
              <div class="tip-step">
                <span class="tip-num">2</span>
                <span>En tu perfil, pulsa <strong>Cambiar foto</strong>.</span>
              </div>
              <div class="tip-step">
                <span class="tip-num">3</span>
                <span>Elige una imagen JPG, PNG o WebP: se recorta sola.</span>
              </div>
              <p class="text-muted small text-center mt-3 mb-0">Este aviso se muestra una sola vez.</p>
            </div>
            <div class="modal-footer border-0 pt-0 justify-content-center">
              <button type="button" class="btn btn-light rounded-pill px-4" (click)="skip()">Ahora no</button>
              <button type="button" class="btn btn-primary rounded-pill px-4" (click)="startTour()">
                <i class="mdi mdi-map-marker-path me-1"></i>Iniciar guía
              </button>
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

  readonly visible = computed(
    () =>
      this.auth.currentUser()?.id != null && this.avatar.loaded() && !this.avatar.url() && !this.avatar.tourSeen(),
  );

  /** Cierra el aviso y deja constancia en la base de datos de que ya se mostró */
  skip(): void {
    this.avatar.markTourSeen();
  }

  startTour(): void {
    this.avatar.markTourSeen();
    this.tour.start();
  }
}
