import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly toastr = inject(ToastrService);

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('authToken');
    let authReq = req;

    if (token && (req.url.startsWith(environment.housesApiUrl) || req.url.startsWith(environment.usersApiUrl))) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('HTTP Error desde Interceptor:', error);

        if (error.status === HttpStatusCode.InternalServerError) {
          this.toastr.error(
            'Ocurrió un error en el servidor. Intenta más tarde.',
            'Error del Servidor'
          );
        }

        return throwError(() => error);
      })
    );
  }
}
