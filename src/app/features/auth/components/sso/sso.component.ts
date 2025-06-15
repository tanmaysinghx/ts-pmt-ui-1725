import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/sso.service';

@Component({
  selector: 'app-sso',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sso.component.html',
  styleUrl: './sso.component.scss'
})
export class SsoComponent implements OnInit {
  currentStatus = 0;
  statusMessages = [
    'Initiating secure connection...',
    'Validating credentials...',
    'Connecting to identity provider...',
    'Finalizing authentication...'
  ];

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService
  ) { }

  ngOnInit() {
    this.cycleStatusMessages();
    this.processSSO();
  }

  private cycleStatusMessages() {
    let index = 0;
    setInterval(() => {
      this.currentStatus = (index + 1) % this.statusMessages.length;
      index = this.currentStatus;
    }, 2500);
  }

  private processSSO() {
    const queryParams = this.route.snapshot.queryParamMap;
    const token = queryParams.get('token');
    const refreshToken = queryParams.get('refreshtoken');
    const redirect = queryParams.get('redirect') ?? sessionStorage.getItem('redirectUrl') ?? '/dashboard';

    if (token && refreshToken) {
      this.authService.isAuthenticated(token, refreshToken).subscribe(
        isValid => {
          if (isValid) {
            this.authService.setToken(token, refreshToken);
            sessionStorage.removeItem('redirectUrl');
            setTimeout(() => {
              this.router.navigateByUrl(redirect);
            }, 5000);
          } else {
            this.tryRefreshTokenOrRedirect();
          }
        },
        err => {
          console.error('Token validation failed:', err);
          this.tryRefreshTokenOrRedirect();
        }
      );
    } else {
      this.tryRefreshTokenOrRedirect();
    }
  }

  private tryRefreshTokenOrRedirect() {
    const refreshToken = this.authService.getRefreshToken();
    if (refreshToken) {
      this.authService.generateTokenFromRefreshToken().subscribe(
        (res) => {
          if (res?.data?.token) {
            this.authService.setToken(res.data.token, refreshToken);
            const redirect = sessionStorage.getItem('redirectUrl') ?? '/dashboard';
            sessionStorage.removeItem('redirectUrl');
            setTimeout(() => {
              this.router.navigateByUrl(redirect);
            }, 5000);
          } else {
            this.handleRedirectToLogin();
          }
        },
        err => {
          console.error('Refresh token failed:', err);
          this.handleRedirectToLogin();
        }
      );
    } else {
      this.handleRedirectToLogin();
    }
  }

  private handleRedirectToLogin() {
    this.authService.clearToken();
    this.router.navigate(['/login']);
  }
}
