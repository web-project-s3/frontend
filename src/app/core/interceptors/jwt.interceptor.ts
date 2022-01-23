import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';
import { EventListenerFocusTrapInertStrategy } from '@angular/cdk/a11y';

@Injectable()
export class Jwt implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem("refresh_token");
    const isApiUrl = request.url.startsWith(environment.apiUrl);
    const isToken = request.url.endsWith("/token");
    const isRegister = request.url.endsWith("/register");

    if ( isToken && refreshToken )
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${refreshToken}` },
      });

    else if (accessToken && isApiUrl && !isRegister )
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}` },
      });

    return next.handle(request);
  }
}
