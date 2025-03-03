import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('authtoken');

    // If the token exists, clone the request and add the Authorization header
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: token // Token is already in 'Bearer your_jwt_token_here' format
        }
      });
    }

    // Pass the modified request to the next handler
    return next.handle(req);
  }
}

