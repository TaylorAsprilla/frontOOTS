import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HttpClient,
  HttpBackend,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { TokenStorageService } from '../services/token-storage.service';
import { RefreshTokenResponse } from '../interfaces/auth.interface';
import { environment } from '../../../environments/environment';

/**
 * Interceptor de autenticación con soporte de refresh token.
 *
 * Flujo:
 * 1. Cada request incluye el header Authorization: Bearer <access_token>.
 * 2. Si el backend responde 401, se intenta renovar el access_token usando
 *    POST /auth/refresh-token con el refresh_token guardado.
 * 3a. Si el refresh es exitoso → se actualizan los tokens y se reintenta el
 *     request original con el nuevo access_token.
 * 3b. Si el refresh también falla con 401 → logout + redirigir al login.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  /** Rutas que NO deben ser interceptadas para la lógica de refresh */
  private readonly SKIP_REFRESH_URLS: string[] = [
    `${environment.apiUrl}/auth/refresh-token`,
    `${environment.apiUrl}/auth/login`,
  ];

  /** HttpClient que bypasea todos los interceptores (evita dependencia circular) */
  private readonly directHttp: HttpClient;

  constructor(
    private router: Router,
    private tokenStorage: TokenStorageService,
    handler: HttpBackend,
  ) {
    this.directHttp = new HttpClient(handler);
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.tokenStorage.getToken();

    // Añadir token si existe y no es una URL de autenticación
    if (token && !this.shouldSkipRefresh(request.url)) {
      request = this.attachToken(request, token);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !this.shouldSkipRefresh(request.url)) {
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      }),
    );
  }

  private attachToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  private shouldSkipRefresh(url: string): boolean {
    return this.SKIP_REFRESH_URLS.some((skipUrl) => url.includes(skipUrl));
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const refreshToken = this.tokenStorage.getRefreshToken();

    if (!refreshToken) {
      this.performLogout();
      return throwError(() => new HttpErrorResponse({ status: 401, statusText: 'No refresh token' }));
    }

    // Si ya está en proceso de refresh, encolar este request hasta que termine
    if (this.isRefreshing) {
      return this.refreshTokenSubject.pipe(
        filter((token) => token !== null),
        take(1),
        switchMap((newToken) => next.handle(this.attachToken(request, newToken!))),
      );
    }

    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    return this.callRefreshEndpoint(refreshToken).pipe(
      switchMap((response: RefreshTokenResponse) => {
        this.isRefreshing = false;
        // Actualizar tokens en storage
        this.tokenStorage.updateTokens(response.access_token, response.refresh_token, response.expires_in);
        this.refreshTokenSubject.next(response.access_token);
        // Reintentar el request original con el nuevo token
        return next.handle(this.attachToken(request, response.access_token));
      }),
      catchError((err) => {
        this.isRefreshing = false;
        this.performLogout();
        return throwError(() => err);
      }),
    );
  }

  /**
   * Llama al endpoint de refresh usando HttpBackend (bypass de interceptores)
   * para evitar dependencia circular.
   */
  private callRefreshEndpoint(refreshToken: string): Observable<RefreshTokenResponse> {
    return this.directHttp.post<RefreshTokenResponse>(`${environment.apiUrl}/auth/refresh-token`, {
      refresh_token: refreshToken,
    });
  }

  private performLogout(): void {
    this.tokenStorage.clearSession();
    this.router.navigate(['/auth/login']);
  }
}
