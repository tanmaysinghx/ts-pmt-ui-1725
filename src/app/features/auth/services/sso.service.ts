import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { catchError, map, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'auth_token';
  private readonly refreshToken = 'refresh_token';

  constructor(
    private readonly router: Router,
    private readonly http: HttpClient,
    private readonly route: ActivatedRoute
  ) { }

  getAuthToken(): string | null {
    return localStorage.getItem(this.tokenKey) ?? this.route.snapshot.queryParamMap.get('token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshToken) ?? this.route.snapshot.queryParamMap.get('refreshtoken');
  }

  setToken(token: string, refreshToken: string) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.refreshToken, refreshToken);
  }

  setAccessToken(token: string) {
    console.log('Setting access token:', token);
    localStorage.setItem(this.tokenKey, token);
  }

  setRefreshToken(token: string) {
    console.log('Setting refresh token:', token);
    localStorage.setItem(this.refreshToken, token);
  }

  isAuthenticated(token: string, refreshToken: string): Observable<boolean> {
    console.log('Checking authentication with token:', token, 'and refreshToken:', refreshToken);
    return this.validateToken(token).pipe(
      map((data: any) => {
        if (data.success && data.data.downstreamResponse.microserviceResponse.data.userId) {
          this.setToken(token, refreshToken);
          return true;
        }
        return false;
      }),
      catchError((err) => {
        console.error('Token validation failed', err);
        return of(false);
      })
    );
  }

  validateToken(token: string): Observable<any> {
    const assetUrl = environment.apiGatewayService + '/1625/v2/api/auth/verify/verify-token';
    const body = { token };
    return this.http.post(assetUrl, body);
  }

  generateTokenFromRefreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    const assetUrl = environment.apiGatewayService + '/1625/v2/api/auth/refresh-token';
    const body = { "refreshToken": refreshToken };
    return this.http.post(assetUrl, body);
  }

  clearToken() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshToken);
  }

  logout() {
    this.clearToken();
    this.router.navigate(['/login']);
  }
}
