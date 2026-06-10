import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const token = localStorage.getItem('token');

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
            // Redirect if token is missing or expired (Unauthorized / Forbidden)
            if (error.status === 401 || error.status === 403) {
                localStorage.removeItem('token');
                router.navigate(['/auth/login']);
            }
            return throwError(() => error);
        })
    );
};