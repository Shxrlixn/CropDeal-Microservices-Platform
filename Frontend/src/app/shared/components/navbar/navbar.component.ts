import { Component, inject } from '@angular/core';
import { UserStore } from '../../../core/services/user.store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  template: `
    <header class="navbar">
      <div class="navbar-left">
        <!-- Optional toggle button for mobile -->
      </div>
      <div class="navbar-right flex items-center gap-md">
        <span class="user-info">
          Welcome, <strong>{{ userStore.user()?.firstName || 'User' }}</strong> 
          <span class="badge badge-accent">{{ userStore.role() }}</span>
        </span>
        <button class="btn btn-outline logout-btn" (click)="logout()">Logout</button>
      </div>
    </header>
  `,
  styles: [`
    .navbar {
      background-color: #ffffff;
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 var(--spacing-xl);
      box-shadow: var(--shadow-sm);
      position: sticky;
      top: 0;
      z-index: 10;
      border-bottom: 1px solid #e0e0e0;
    }
    .user-info {
      font-size: 1rem;
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      color: var(--color-text-dark);
    }
    .badge-accent {
      background-color: var(--color-accent);
      color: var(--color-text-dark);
    }
    .logout-btn {
      padding: 6px 16px;
      font-size: 0.9rem;
    }
  `]
})
export class NavbarComponent {
  userStore = inject(UserStore);
  router = inject(Router);

  logout() {
    this.userStore.logout();
    this.router.navigate(['/auth/login']);
  }
}
