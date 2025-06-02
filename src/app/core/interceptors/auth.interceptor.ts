// auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../features/auth/services/sso.service';
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

export const AuthInterceptor: HttpInterceptorFn = (
    req: HttpRequest<any>,
    next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
    const authService = inject(AuthService);
    const token = authService.getToken();
    console.log('AuthInterceptorFn: intercepting', req.url, token);

    if (token) {
        req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 500 || error.status === 401) {
                return authService.generateTokenFromRefreshToken().pipe(
                    switchMap((newToken: any) => {
                        console.log('AuthInterceptorFn: new token received', newToken.data.accessToken);
                        authService.setRefreshToken(newToken.data.accessToken);
                        const newReq = req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } });
                        return next(newReq);
                    }),
                    catchError((err) => {
                        authService.logout();
                        return throwError(() => err);
                    })
                );
            }
            return throwError(() => error);
        })
    );
};
