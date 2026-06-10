import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserStore } from '../../../core/services/user.store';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo-icon">🌾</div>
        <h2>CropDeal</h2>
        <div class="role-badge" *ngIf="userStore.role()">{{ userStore.role() }}</div>
      </div>

      <nav class="sidebar-nav">

        <!-- CORE -->
        <div class="nav-section-label">Overview</div>
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">📊 Dashboard</a>

        <!-- ADMIN -->
        <ng-container *ngIf="userStore.role() === 'ADMIN' || userStore.role() === 'ROLE_ADMIN'">
          <div class="nav-section-label">Admin Control</div>
          <a routerLink="/admin/farmers" routerLinkActive="active" class="nav-item">🧑‍🌾 Manage Farmers</a>
          <a routerLink="/admin/dealers" routerLinkActive="active" class="nav-item">🤝 Manage Dealers</a>
        </ng-container>


        <!-- FARMER -->
        <ng-container *ngIf="userStore.role() === 'ROLE_FARMER' || userStore.role() === 'FARMER'">
          <div class="nav-section-label">Farmer</div>
          <a routerLink="/farmer/add" routerLinkActive="active" class="nav-item">➕ Register Farmer</a>
          <a routerLink="/farmer/list" routerLinkActive="active" class="nav-item">👨‍🌾 View Farmers</a>
        </ng-container>

        <!-- CROP -->
        <ng-container *ngIf="userStore.role() === 'ROLE_FARMER' || userStore.role() === 'FARMER' || userStore.role() === 'ROLE_DEALER' || userStore.role() === 'DEALER'">
          <div class="nav-section-label">Crop</div>
          <a *ngIf="userStore.role() === 'ROLE_FARMER' || userStore.role() === 'FARMER'" routerLink="/crop/add" routerLinkActive="active" class="nav-item">🌱 Add Crop</a>
          <a routerLink="/crop/list" routerLinkActive="active" class="nav-item">🌾 View Crops</a>
          <a *ngIf="userStore.role() === 'ROLE_DEALER' || userStore.role() === 'DEALER'" routerLink="/crop/subscription" routerLinkActive="active" class="nav-item">🔔 Subscribe</a>
        </ng-container>

        <!-- DEALER -->
        <ng-container *ngIf="userStore.role() === 'ROLE_DEALER' || userStore.role() === 'DEALER'">
          <div class="nav-section-label">Dealer</div>
          <a routerLink="/dealer/buy" routerLinkActive="active" class="nav-item">🛒 Buy Crop</a>
          <a routerLink="/dealer/crops" routerLinkActive="active" class="nav-item">📋 Browse Crops</a>
        </ng-container>

        <!-- ORDERS -->
        <ng-container *ngIf="userStore.role() === 'ROLE_DEALER' || userStore.role() === 'DEALER'">
          <div class="nav-section-label">Orders</div>
          <a routerLink="/orders/create" routerLinkActive="active" class="nav-item">📦 Create Order</a>
          <a routerLink="/orders/history" routerLinkActive="active" class="nav-item">📜 Order History</a>
          <a routerLink="/orders/invoice" routerLinkActive="active" class="nav-item">🧾 Invoice</a>
        </ng-container>

        <!-- Logout -->
        <div style="flex:1"></div>
        <button class="logout-btn" (click)="logout()">🚪 Logout</button>

      </nav>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 240px;
      min-width: 240px;
      background: linear-gradient(180deg, #1b5e20 0%, #2e7d32 100%);
      color: #fff;
      display: flex;
      flex-direction: column;
      height: 100vh;
      position: sticky;
      top: 0;
      box-shadow: 4px 0 12px rgba(0,0,0,0.15);
      z-index: 20;
    }
    .sidebar-header {
      padding: 20px 16px 16px;
      background: rgba(0,0,0,0.2);
      text-align: center;
      border-bottom: 1px solid rgba(255,255,255,0.15);
    }
    .logo-icon { font-size: 2.2rem; line-height: 1; }
    .sidebar-header h2 {
      color: #fff;
      margin: 6px 0 0;
      font-size: 1.4rem;
      letter-spacing: 1px;
      font-weight: 700;
    }
    .role-badge {
      display: inline-block;
      margin-top: 6px;
      padding: 2px 10px;
      background: rgba(255,255,255,0.2);
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    .sidebar-nav {
      padding: 8px 0 16px;
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow-y: auto;
    }
    .nav-section-label {
      padding: 12px 16px 4px;
      font-size: 0.68rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.2px;
      color: rgba(255,255,255,0.5);
      margin-top: 4px;
    }
    .nav-item {
      padding: 10px 16px 10px 20px;
      color: rgba(255,255,255,0.85);
      transition: all 0.15s;
      border-left: 3px solid transparent;
      display: block;
      font-size: 0.95rem;
      font-weight: 500;
      text-decoration: none;
    }
    .nav-item:hover {
      color: #fff;
      background: rgba(255,255,255,0.1);
      border-left-color: #a5d6a7;
    }
    .nav-item.active {
      color: #fff;
      background: rgba(255,255,255,0.15);
      border-left-color: #69f0ae;
      font-weight: 600;
    }
    .logout-btn {
      margin: 8px 12px;
      padding: 10px;
      background: rgba(255,255,255,0.1);
      color: rgba(255,255,255,0.8);
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.15s;
    }
    .logout-btn:hover {
      background: rgba(255,0,0,0.25);
      color: #fff;
      border-color: rgba(255,100,100,0.5);
    }
  `]
})
export class SidebarComponent {
  userStore = inject(UserStore);

  logout() {
    this.userStore.logout();
    window.location.href = '/auth/login';
  }
}
