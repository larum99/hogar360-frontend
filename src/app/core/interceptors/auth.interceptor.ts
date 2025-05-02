import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImxhcnVtYnM5OUBnbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJpZCI6MTAsInN1YiI6ImxhcnVtYnM5OUBnbWFpbC5jb20iLCJpYXQiOjE3NDYwNjE4NjMsImV4cCI6MTc0NjE0ODI2M30.Kn92774aOvE3o4QaVbTE6a9zcYvVz9SwpUwmn_FDVm0';

    if (req.method === 'POST') {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      return next.handle(authReq);
    }

    return next.handle(req);
  }
}
