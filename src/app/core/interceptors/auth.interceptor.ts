import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

/**
 * Interceptor para agregar el token JWT a todas las peticiones HTTP
 * y manejar errores de autenticación
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Obtener el token del localStorage
    const currentUser = localStorage.getItem('currentUser');

    if (currentUser) {
      try {
        const user = JSON.parse(currentUser);
        const token = user.token;

        // Si existe token, agregarlo al header Authorization
        if (token) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    // Continuar con la petición y manejar errores
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token inválido o expirado - redirigir a login
          localStorage.removeItem('currentUser');
          this.router.navigate(['/auth/login'], {
            queryParams: { returnUrl: this.router.url },
          });
        }

        return throwError(() => error);
      })
    );
  }
}
