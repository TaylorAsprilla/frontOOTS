import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, of, shareReplay, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenStorageService } from './token-storage.service';

/**
 * Fotos de otros usuarios (lista de usuarios). Se guardan en memoria por usuario
 * y fecha de cambio: si el usuario cambia su foto, `version` cambia y se vuelve a descargar.
 */
@Injectable({ providedIn: 'root' })
export class UserAvatarService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorage = inject(TokenStorageService);
  private readonly cache = new Map<string, Observable<string | null>>();

  url(userId: number, version: string | null | undefined): Observable<string | null> {
    const key = `${userId}:${version ?? ''}`;
    let entry = this.cache.get(key);
    if (!entry) {
      // Se descartan las versiones anteriores de este usuario
      for (const existing of this.cache.keys()) {
        if (existing.startsWith(`${userId}:`)) this.cache.delete(existing);
      }
      const headers = new HttpHeaders({ Authorization: `Bearer ${this.tokenStorage.getToken()}` });
      entry = this.http
        .get(`${environment.apiUrl}/users/${userId}/avatar`, {
          headers,
          params: { v: version ?? '' },
          responseType: 'blob',
          observe: 'response',
        })
        .pipe(
          map((response: HttpResponse<Blob>) =>
            response.status === 200 && response.body ? URL.createObjectURL(response.body) : null,
          ),
          catchError(() => of(null)),
          shareReplay(1),
        );
      this.cache.set(key, entry);
    }
    return entry;
  }
}
