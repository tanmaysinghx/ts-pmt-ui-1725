import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/sso.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;

  constructor(private readonly fb: FormBuilder, private readonly authService: AuthService, private readonly router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  ngOnInit() {
    const token = this.authService.getAuthToken();
    const refreshToken = this.authService.getRefreshToken();

    if (token && refreshToken) {
      this.authService.isAuthenticated(token, refreshToken).subscribe(isAuth => {
        if (isAuth) {
          this.router.navigate(['/dashboard']);
        }
      }, error => {
        console.error('Error verifying token:', error);
        this.authService.clearToken();
      });
    }
  }

  get showEmailError() {
    const control = this.loginForm.get('email');
    return (control?.invalid && (control?.touched || this.submitted));
  }

  get showPasswordError() {
    const control = this.loginForm.get('password');
    return (control?.invalid && (control?.touched || this.submitted));
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.valid) {
      console.log('Form submitted:', this.loginForm.value);
      // Add your authentication logic here
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

}
