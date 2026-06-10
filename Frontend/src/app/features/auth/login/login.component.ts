import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserStore } from '../../../core/services/user.store';

function decodeJwt(token: string): any {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="login-left">
        <div class="hero-overlay flex flex-col justify-center p-lg h-full">
          <h1 class="hero-title mb-md">Empowering<br>Farmers & Dealers</h1>
          <p class="hero-subtitle">Join CropDeal to trade fresh agricultural produce seamlessly.</p>
        </div>
      </div>
      <div class="login-right flex justify-center items-center">
        <div class="login-card">
          <div class="text-center mb-lg">
            <h1 class="brand-title">CropDeal 🌱</h1>
            <p class="text-muted mt-sm">Sign in to your account</p>
          </div>

          <div *ngIf="error" class="badge badge-danger w-full mb-md p-sm text-center">
            {{ error }}
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label class="form-label" for="email">Email Address</label>
              <input
                type="email"
                id="email"
                formControlName="email"
                class="form-control"
                placeholder="farmer@cropdeal.com"
              >
              <div *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.invalid" class="error-message">
                Please enter a valid email.
              </div>
            </div>

            <div class="form-group mb-lg">
              <label class="form-label" for="password">Password</label>
              <input
                type="password"
                id="password"
                formControlName="password"
                class="form-control"
                placeholder="Enter your password"
              >
              <div *ngIf="loginForm.get('password')?.touched && loginForm.get('password')?.invalid" class="error-message">
                Password is required.
              </div>
            </div>

            <button type="submit" class="btn btn-primary w-full login-btn" [disabled]="loginForm.invalid || isLoading">
              <span *ngIf="!isLoading">Sign In</span>
              <span *ngIf="isLoading" class="spinner"></span>
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      min-height: 100vh;
      width: 100vw;
      overflow: hidden;
      background-color: var(--color-background);
    }
    .login-left {
      flex: 1.2;
      background-color: var(--color-primary);
      background-size: cover;
      background-position: center;
      position: relative;
      display: none;
    }
    @media (min-width: 768px) {
      .login-left {
        display: block;
      }
    }
    .hero-overlay {
      background: linear-gradient(to right, rgba(27, 94, 32, 0.9) 0%, rgba(46, 125, 50, 0.4) 100%);
      color: var(--color-text-light);
    }
    .hero-title {
      font-size: 3.5rem;
      font-weight: 700;
      line-height: 1.1;
      color: #ffffff;
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }
    .hero-subtitle {
      font-size: 1.25rem;
      max-width: 400px;
      margin-top: var(--spacing-sm);
      opacity: 0.9;
    }
    .login-right {
      flex: 1;
      background-color: #ffffff;
      box-shadow: -10px 0 30px rgba(0,0,0,0.05);
      z-index: 10;
    }
    .login-card {
      width: 100%;
      max-width: 420px;
      padding: var(--spacing-xl);
    }
    .brand-title {
      color: var(--color-primary);
      font-size: 2.5rem;
      letter-spacing: -0.5px;
    }
    .login-btn {
      padding: 14px;
      font-size: 1.1rem;
      position: relative;
    }
    .spinner {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 3px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      border-top-color: #fff;
      animation: spin 1s ease-in-out infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private userStore = inject(UserStore);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  isLoading = false;
  error = '';

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.error = '';

    const email = this.loginForm.value.email || '';
    const password = this.loginForm.value.password || '';

    this.authService.login(email, password).subscribe({
      next: (res: any) => {
        const token = res.token || res.accessToken || res;
        if (!token) {
          this.error = 'Login failed: no token received';
          this.isLoading = false;
          return;
        }

        // 1. Store token immediately
        this.userStore.setToken(token);

        // 2. Decode JWT to get email for profile fetch
        const payload = decodeJwt(token);
        const userEmail = payload?.sub || payload?.email || email;

        // 3. Fetch full user details to get authoritative role
        this.authService.getUserProfile(userEmail).subscribe({
          next: (user) => {
            this.userStore.setUser(user);
            this.isLoading = false;
            this.redirectByRole(user.role);
          },
          error: (err) => {
            console.error('Failed to fetch user profile', err);
            // Fallback to role from JWT if profile fetch fails
            const roleRaw = payload?.role || payload?.roles?.[0] || payload?.authorities?.[0]?.replace('ROLE_', '');
            if (roleRaw) {
              this.userStore.setUser({ email: userEmail, role: roleRaw } as any);
              this.redirectByRole(roleRaw);
            } else {
              this.error = 'Could not determine user role';
            }
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        this.error = err.status === 0 ? 'Backend not running' : 'Invalid credentials';
        this.isLoading = false;
      }
    });
  }

  private redirectByRole(role: string) {
    switch (role) {
      case 'ADMIN':
      case 'ROLE_ADMIN':
        this.router.navigate(['/dashboard']);
        break;
      case 'FARMER':
      case 'ROLE_FARMER':
        this.router.navigate(['/farmer/add']);
        break;
      case 'DEALER':
      case 'ROLE_DEALER':
        this.router.navigate(['/dealer/buy']);
        break;
      default:
        this.router.navigate(['/dashboard']);
        break;
    }
  }
}
