import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.group(`🌐 HTTP ${req.method} Request`);
    console.log('URL:', req.url);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.groupEnd();

    const startTime = Date.now();

    return next.handle(req).pipe(
      tap({
        next: (event) => {
          if (event instanceof HttpResponse) {
            const duration = Date.now() - startTime;
            console.group(`✅ HTTP ${req.method} Response (${duration}ms)`);
            console.log('Status:', event.status);
            console.log('Headers:', event.headers);
            console.log('Body:', event.body);
            console.groupEnd();
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
