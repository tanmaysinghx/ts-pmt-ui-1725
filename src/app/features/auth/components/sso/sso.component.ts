import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/sso.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-sso',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sso.component.html',
  styleUrls: ['./sso.component.scss'],
})
export class SsoComponent implements OnInit, OnDestroy {
  currentStatusIndex = 0;
  statusMessages = [
    '🔒 Initiating secure connection...',
    '🔑 Validating credentials...',
    '🔄 Connecting to identity provider...',
    '⚡ Finalizing authentication...',
    '➡️ Redirecting to dashboard...'
  ];

  private statusSub?: Subscription;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService,
  ) { }

  ngOnInit() {
    this.startStatusCycle();
    this.processSSO();
  }

  ngOnDestroy() {
    this.statusSub?.unsubscribe();
  }

  private startStatusCycle() {
    this.statusSub = interval(2000).subscribe(() => {
      this.currentStatusIndex =
        (this.currentStatusIndex + 1) % this.statusMessages.length;
    });
  }

  private processSSO() {
    const queryParams = this.route.snapshot.queryParamMap;
    const accessToken = queryParams.get('accessToken');
    const refreshToken = queryParams.get('refreshToken');
    const userEmail = queryParams.get('userEmail');
    const redirect = queryParams.get('redirect') ?? sessionStorage.getItem('redirectUrl') ?? '/dashboard';

    console.log('Received Query Params:', {
      accessToken,
      refreshToken,
      userEmail,
      redirect
    });

    if (accessToken && refreshToken && userEmail) {
      this.storeSession(accessToken, refreshToken, userEmail);
      this.validateAndRedirect(accessToken, refreshToken, userEmail, redirect);
    } else {
      console.warn('⚠️ Missing SSO params. Trying refresh token...');
      this.tryRefreshTokenOrRedirect(redirect);
    }
  }

  private storeSession(accessToken: string, refreshToken: string, email: string) {
    localStorage.setItem('access-token', accessToken);
    localStorage.setItem('refresh-token', refreshToken);
    localStorage.setItem('user-email', email);

    sessionStorage.setItem('access-token', accessToken);
    sessionStorage.setItem('refresh-token', refreshToken);
    sessionStorage.setItem('user-email', email);
  }

  private validateAndRedirect(
    accessToken: string,
    refreshToken: string,
    email: string,
    redirect: string
  ) {
    this.authService.isAuthenticated(accessToken, refreshToken, email).subscribe({
      next: (isValid) => {
        if (isValid) {
          console.log('✅ Token validated. Redirecting...');
          setTimeout(() => this.router.navigateByUrl(redirect), 2500);
        } else {
          console.warn('❌ Token invalid. Trying refresh...');
          this.tryRefreshTokenOrRedirect(redirect);
        }
      },
      error: (err) => {
        console.error('❌ Token validation failed:', err);
        this.tryRefreshTokenOrRedirect(redirect);
      }
    });
  }

  private tryRefreshTokenOrRedirect(redirect: string) {
    const refreshToken = this.authService.getRefreshToken()

    if (!refreshToken) {
      console.warn('❌ No refresh token found.');
      this.handleRedirectToLogin();
      return;
    }

    this.authService.generateTokenFromRefreshToken().subscribe({
      next: (res: any) => {
        const newAccessToken = res?.data?.downstreamResponse?.data?.accessToken;
        if (newAccessToken) {
          console.log('✅ Token refreshed. Updating session...');
          this.storeSession(newAccessToken, refreshToken, localStorage.getItem('user-email') || '');
          setTimeout(() => this.router.navigateByUrl(redirect), 2500);
        } else {
          console.warn('❌ Refresh token response invalid.');
          this.handleRedirectToLogin();
        }
      },
      error: (err) => {
        console.error('❌ Refresh token request failed:', err);
        this.handleRedirectToLogin();
      }
    });
  }

  private handleRedirectToLogin() {
    console.log('Redirecting to login...');
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}