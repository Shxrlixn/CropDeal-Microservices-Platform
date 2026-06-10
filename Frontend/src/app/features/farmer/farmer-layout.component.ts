import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-farmer-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div style="padding:0;">
      <!-- Page Header -->
      <div style="background:linear-gradient(to right,#1b5e20,#388e3c); padding:24px 28px; color:#fff; margin-bottom:0;">
        <h1 style="margin:0 0 4px; font-size:1.8rem;">👨‍🌾 Farmer Management</h1>
        <p style="margin:0; opacity:0.85;">Register farmers and view the farmer list</p>
      </div>

      <!-- Tab Bar -->
      <div style="background:#fff; border-bottom:2px solid #e0e0e0; display:flex; gap:0; padding:0 20px;">
        <a routerLink="/farmer/add" routerLinkActive="tab-active" class="tab-link">➕ Register Farmer</a>
        <a routerLink="/farmer/list" routerLinkActive="tab-active" class="tab-link">📋 View Farmers</a>
      </div>

      <!-- Routed Content -->
      <div style="padding:24px;">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .tab-link {
      padding: 14px 24px;
      font-weight: 600;
      font-size: 0.95rem;
      color: #555;
      border-bottom: 3px solid transparent;
      transition: all 0.15s;
      text-decoration: none;
      display: inline-block;
    }
    .tab-link:hover { color: #2e7d32; background: #f9fbe7; }
    .tab-link.tab-active { color: #2e7d32; border-bottom-color: #2e7d32; }
  `]
})
export class FarmerLayoutComponent {}
