import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'access-token';
  private readonly REFRESH_TOKEN_KEY = 'refresh-token';

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly http: HttpClient
  ) { }

  /** Get access token (localStorage or query param fallback) */
  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY) ?? this.route.snapshot.queryParamMap.get('accessToken');
  }

  /** Get refresh token (localStorage or query param fallback) */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY) ?? this.route.snapshot.queryParamMap.get('refreshToken');
  }

  /** Save tokens */
  setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  /** Save only access token */
  setAccessToken(token: string) {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }

  /** Save only refresh token */
  setRefreshToken(token: string) {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  /** Validate access token with backend */
  isAuthenticated(accessToken: string, refreshToken: string, userEmail: string): Observable<boolean> {
    console.log('Authenticating with accessToken:', accessToken, 'and userEmail:', userEmail);
    return this.validateToken(accessToken, userEmail).pipe(
      map((res: any) => {
        if (res?.success) {
          this.setTokens(accessToken, refreshToken);
          return true;
        }
        return false;
      }),
      catchError(err => {
        console.error('Token validation failed', err);
        return of(false);
      })
    );
  }

  /** Validate token endpoint */
  validateToken(accessToken: string, userEmail: string): Observable<any> {
    const url = `${environment.apiGatewayService}/trigger-workflow/WF1625E10004?apiEndpoint=/v2/api/auth/verify/verify-token`;
    const body = { token: accessToken, email: userEmail }; // ✅ email included
    console.log('Validating token:', body);
    return this.http.post(url, body).pipe(
      catchError(err => {
        console.error('Validate token HTTP error:', err);
        return throwError(() => err);
      })
    );
  }

  /** Refresh access token using refresh token (include email in body) */
  generateTokenFromRefreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    const email = localStorage.getItem('user-email') ?? this.route.snapshot.queryParamMap.get('userEmail');

    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }
    if (!email) {
      return throwError(() => new Error('No user email available'));
    }

    const url = `${environment.apiGatewayService}/trigger-workflow/WF1625E10005?apiEndpoint=/v2/api/auth/refresh-token''`;
    const body = { refreshToken, email }; // ✅ include email here
    console.log('Refreshing token with body:', body);

    return this.http.post(url, body).pipe(
      catchError(err => {
        console.error('Refresh token HTTP error:', err);
        return throwError(() => err);
      })
    );
  }


  /** Clear tokens from localStorage */
  clearTokens() {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  login(email: string, password: string): Observable<any> {
    const url = `${environment.apiGatewayService}/trigger-workflow/WF1625E10001?apiEndpoint=/v2/api/auth/login`;
    const body = { email, password };
    return this.http.post(url, body).pipe(
      catchError(err => {
        console.error('Login HTTP error:', err);
        return throwError(() => err);
      })
    );
  }

  /** Logout user */
  logout() {
    this.clearTokens();
    this.router.navigate(['/login']);
  }

  /** Optional: Decode email from JWT (if needed) */
  decodeEmailFromToken(token: string): string | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.email ?? null;
    } catch {
      return null;
    }
  }



  /** Read access token from localStorage or query param */
  getAuthToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY) ?? this.route.snapshot.queryParamMap.get('accessToken');
  }

  /** Save new tokens to localStorage */
  setToken(accessToken: string, refreshToken: string) {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

}