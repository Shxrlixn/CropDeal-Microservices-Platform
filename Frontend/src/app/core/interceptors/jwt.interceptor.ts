import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { UserStore } from '../services/user.store';
import { environment } from '../../../environments/environment';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const userStore = inject(UserStore);
  const router = inject(Router);
  // Get token from localStorage as a fallback to ensure persistence across refreshes
  const token = userStore.token() || localStorage.getItem('token');

  const isApiUrl = req.url.startsWith(environment.apiGateway);

  if (token && isApiUrl) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        // Token is expired or invalid
        userStore.logout();
        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    })
  );
};
