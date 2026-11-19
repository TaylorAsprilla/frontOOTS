import { Injectable, inject } from '@angular/core';
import { JoyrideService } from 'ngx-joyride';

/** Nombres de los pasos de la guía (se enlazan con `joyrideStep` en las plantillas) */
export const AVATAR_TOUR_MENU_STEP = 'avatarMenuStep';
export const AVATAR_TOUR_CHANGE_STEP = 'avatarChangeStep';

/** Recorrido guiado: menú del usuario → Mi cuenta → botón «Cambiar foto» */
@Injectable({ providedIn: 'root' })
export class AvatarTourService {
  private readonly joyride = inject(JoyrideService);

  start(): void {
    this.joyride.startTour({
      steps: [AVATAR_TOUR_MENU_STEP, `${AVATAR_TOUR_CHANGE_STEP}@users/profile`],
      showCounter: true,
      showPrevButton: true,
      themeColor: '#2f3e5c',
      customTexts: { prev: 'Anterior', next: 'Siguiente', done: 'Listo', close: 'Cerrar' },
    });
  }
}
