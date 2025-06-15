import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../features/auth/services/sso.service';

import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

export const AuthInterceptor: HttpInterceptorFn = (
    req: HttpRequest<any>,
    next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
    const authService = inject(AuthService);
    const token = authService.getAuthToken();
    console.log('AuthInterceptorFn: intercepting', req.url, token);
    if (token) {
        req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 500 || error.status === 401) {
                return authService.generateTokenFromRefreshToken().pipe(
                    switchMap((newToken: any) => {
                        const accessToken = newToken?.data?.accessToken;
                        if (!accessToken) {
                            throw new Error('No access token in refresh response');
                        }
                        console.log('AuthInterceptorFn: new token received', accessToken);
                        authService.setToken(accessToken, authService.getRefreshToken()!);
                        const newReq = req.clone({
                            setHeaders: { Authorization: `Bearer ${accessToken}` }
                        });
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
