import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/sso.service';

@Component({
  selector: 'app-sso',
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
    this.simulateAuthentication();
    this.checkLoginToken();
  }

  private cycleStatusMessages() {
    let index = 0;
    setInterval(() => {
      this.currentStatus = (index + 1) % this.statusMessages.length;
      index = this.currentStatus;
    }, 2500);
  }

  private simulateAuthentication() {
    setTimeout(() => {
      // Replace with actual navigation logic
      this.router.navigate(['/dashboard']);
    }, 10000);
  }

  private checkLoginToken() {
    const token = this.authService.getToken();
    const refreshToken = this.authService.getRefreshToken();
    if (token && refreshToken) {
      this.authService.isAuthenticated(token, refreshToken).subscribe((isValid) => {
        if (isValid) {
          this.authService.setToken(token, refreshToken);
          const redirectUrl = sessionStorage.getItem('redirectUrl') ?? '/dashboard';
          sessionStorage.removeItem('redirectUrl');
          this.router.navigateByUrl(redirectUrl);
        } else {
          this.router.navigate(['/login']);
          this.authService.clearToken();
        }
      }, (error) => {
        console.error('Token validation failed', error);
        this.authService.clearToken();
        this.router.navigate(['/login']);
      });
    } else {
      this.authService.clearToken();
      this.router.navigate(['/login']);
    }
  }

}






