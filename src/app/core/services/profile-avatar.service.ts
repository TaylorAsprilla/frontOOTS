import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from './auth.service';
import { TokenStorageService } from './token-storage.service';

export const AVATAR_ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
/** Tamaño máximo de la foto original que se acepta antes de redimensionarla */
export const AVATAR_MAX_SOURCE_MB = 10;
const AVATAR_SIZE_PX = 400;

/**
 * Foto de perfil del usuario autenticado. La imagen está en un bucket privado:
 * se descarga con el token y se muestra como URL local (blob).
 */
@Injectable({ providedIn: 'root' })
export class ProfileAvatarService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorage = inject(TokenStorageService);
  private readonly auth = inject(AuthenticationService);
  private readonly apiUrl = `${environment.apiUrl}/auth/profile/avatar`;

  /** URL local de la foto, o null si el usuario no tiene */
  readonly url = signal<string | null>(null);
  /** Aumenta cada vez que el usuario cambia o quita su foto (para refrescar otras vistas) */
  readonly version = signal(0);
  /** true cuando ya se consultó al servidor si el usuario tiene foto y si vio la guía */
  readonly loaded = signal(false);
  /** true si el usuario ya vio la guía de la foto (guardado en la base de datos) */
  readonly tourSeen = signal(true);
  private loadedForUserId: number | null = null;
  private photoChecked = false;
  private statusChecked = false;

  private headers(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.tokenStorage.getToken()}` });
  }

  /** Carga la foto una vez por usuario (se recarga si cambia la sesión) */
  ensureLoaded(): void {
    const userId = this.auth.currentUser()?.id ?? null;
    if (userId === null) {
      this.setUrl(null);
      this.loaded.set(false);
      this.loadedForUserId = null;
      return;
    }
    if (this.loadedForUserId === userId) return;
    this.loadedForUserId = userId;
    this.loaded.set(false);
    this.photoChecked = false;
    this.statusChecked = false;
    this.reload();
    this.loadStatus();
  }

  private loadStatus(): void {
    this.http
      .get<{ data?: { tourSeen: boolean }; tourSeen?: boolean }>(`${this.apiUrl}/status`, { headers: this.headers() })
      .subscribe({
        next: (response) => {
          this.tourSeen.set(!!(response.data?.tourSeen ?? response.tourSeen));
          this.statusChecked = true;
          this.markLoadedIfReady();
        },
        // Si falla, no se sabe si ya la vio: no se muestra la guía
        error: () => this.tourSeen.set(true),
      });
  }

  /** Guarda en la base de datos que el usuario ya vio la guía (no vuelve a aparecer) */
  markTourSeen(): void {
    this.tourSeen.set(true);
    this.http.put(`${this.apiUrl}/tour-seen`, null, { headers: this.headers() }).subscribe({ error: () => undefined });
  }

  reload(): void {
    this.http
      .get(this.apiUrl, {
        headers: this.headers(),
        params: { t: Date.now() }, // evita la copia en caché del navegador tras cambiar la foto
        responseType: 'blob',
        observe: 'response',
      })
      .subscribe({
        next: (response: HttpResponse<Blob>) => {
          // 204: el usuario no tiene foto
          this.setUrl(response.status === 200 && response.body ? URL.createObjectURL(response.body) : null);
          this.photoChecked = true;
          this.markLoadedIfReady();
        },
        // Si falla la consulta no se sabe si tiene foto: no se muestra el aviso
        error: () => this.setUrl(null),
      });
  }

  upload(image: Blob): Observable<unknown> {
    const form = new FormData();
    form.append('file', image, 'avatar.jpg');
    return this.http.put(this.apiUrl, form, { headers: this.headers() }).pipe(tap(() => {
        this.version.update((v) => v + 1);
        this.reload();
      }));
  }

  remove(): Observable<unknown> {
    return this.http.delete(this.apiUrl, { headers: this.headers() }).pipe(tap(() => {
        this.version.update((v) => v + 1);
        this.setUrl(null);
      }));
  }

  /** Recorta al centro (cuadrado) y reduce a 400 px en JPEG para que pese poco */
  async prepare(file: File): Promise<Blob> {
    const bitmap = await createImageBitmap(file);
    const side = Math.min(bitmap.width, bitmap.height);
    const canvas = document.createElement('canvas');
    canvas.width = AVATAR_SIZE_PX;
    canvas.height = AVATAR_SIZE_PX;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('canvas no disponible');
    context.drawImage(
      bitmap,
      (bitmap.width - side) / 2,
      (bitmap.height - side) / 2,
      side,
      side,
      0,
      0,
      AVATAR_SIZE_PX,
      AVATAR_SIZE_PX,
    );
    bitmap.close();
    return await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('No se pudo procesar la imagen'))), 'image/jpeg', 0.88),
    );
  }

  /** `loaded` solo es true cuando se conocen la foto y el estado de la guía (evita parpadeos) */
  private markLoadedIfReady(): void {
    if (this.photoChecked && this.statusChecked) this.loaded.set(true);
  }

  private setUrl(next: string | null): void {
    const previous = this.url();
    if (previous) URL.revokeObjectURL(previous);
    this.url.set(next);
  }
}
