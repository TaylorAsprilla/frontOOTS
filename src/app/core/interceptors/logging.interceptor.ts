import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const startTime = Date.now();

    return next.handle(req).pipe(
      tap({
        next: (event) => {
          if (event instanceof HttpResponse) {
            const duration = Date.now() - startTime;
          }
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          console.group(`❌ HTTP ${req.method} Error (${duration}ms)`);
          console.error('Error:', error);
          console.error('Status:', error.status);
          console.error('Message:', error.message);
          console.error('Error Body:', error.error);
          console.groupEnd();
        },
      })
    );
  }
}
