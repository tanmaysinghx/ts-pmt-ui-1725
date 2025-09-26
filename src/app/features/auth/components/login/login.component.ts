import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/sso.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  ngOnInit() {
    const token = this.authService.getAccessToken();
    const refreshToken = this.authService.getRefreshToken();
    const userEmail = localStorage.getItem('user-email');

    // Auto-login if valid token exists
    if (token && refreshToken && userEmail) {
      this.authService.isAuthenticated(token, refreshToken, userEmail).subscribe(isAuth => {
        if (isAuth) {
          this.router.navigate(['/dashboard']);
        } else {
          this.authService.clearTokens();
        }
      }, error => {
        console.error('Error verifying token:', error);
        this.authService.clearTokens();
      });
    }
  }

  /** Form validation getters */
  get showEmailError() {
    const control = this.loginForm.get('email');
    return control?.invalid && (control?.touched || this.submitted);
  }

  get showPasswordError() {
    const control = this.loginForm.get('password');
    return control?.invalid && (control?.touched || this.submitted);
  }

  /** Submit login form */
  onSubmit() {
    this.submitted = true;

    if (this.loginForm.valid) {
      const { email, password, rememberMe } = this.loginForm.value;
      console.log('Form submitted:', { email, password, rememberMe });

      // Example login flow:
      this.authService.login(email, password).subscribe({
        next: (res: any) => {
          const accessToken = res?.accessToken;
          const refreshToken = res?.refreshToken;
          if (accessToken && refreshToken) {
            this.authService.setTokens(accessToken, refreshToken);
            localStorage.setItem('user-email', email);

            if (!rememberMe) {
              // Optional: clear tokens when browser closes
              window.addEventListener('beforeunload', () => {
                this.authService.clearTokens();
              });
            }

            this.router.navigate(['/dashboard']);
          }
        },
        error: (err) => {
          console.error('Login failed:', err);
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
