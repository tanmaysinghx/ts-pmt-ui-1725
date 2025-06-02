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
  constructor(private readonly router: Router, private readonly http: HttpClient, private readonly route: ActivatedRoute) { }

  setToken(token: string, refreshToken: string) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.refreshToken, refreshToken);
  }

  setRefreshToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  isAuthenticated(token: string, refreshToken: string): Observable<boolean> {
    return this.validateToken(token).pipe(
      map((data: any) => {
        if (data.success && data.data.userId) {
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
    let assetUrl = environment.ssoService + '/auth/verify/verify-token';
    let body = {
      "token": token
    }
    return this.http.post(assetUrl, body);
  }

  generateTokenFromRefreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    let assetUrl = environment.ssoService + '/auth/refresh-token';
    let body = {
      "refreshToken": refreshToken
    }
    return this.http.post(assetUrl, body);
  }

  getToken(): string | null {
    const token = this.route.snapshot.queryParamMap.get('token') ?? localStorage.getItem(this.tokenKey);
    return token;
  }

  getRefreshToken(): string | null {
    const refreshToken = this.route.snapshot.queryParamMap.get('refreshtoken') ?? localStorage.getItem(this.refreshToken);
    return refreshToken;
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
