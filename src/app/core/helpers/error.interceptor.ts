import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        // Los errores 401 son manejados por AuthInterceptor (refresh token flow).
        // Aquí solo se propagan otros errores para que los componentes los manejen.
        const error = err?.error?.message || err?.statusText || err?.message || 'Unknown error';
        return throwError(() => error);
      }),
    );
  }
}
