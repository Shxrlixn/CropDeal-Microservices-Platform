import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserStore } from '../../core/services/user.store';

@Component({
  selector: 'app-crop-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div>
      <div style="background:linear-gradient(to right,#1b5e20,#388e3c); padding:24px 28px; color:#fff; margin-bottom:0;">
        <h1 style="margin:0 0 4px; font-size:1.8rem;">🌾 Crop Management</h1>
        <p style="margin:0; opacity:0.85;">Add crops, view the crop list, and manage subscriptions</p>
      </div>
      <div style="background:#fff; border-bottom:2px solid #e0e0e0; display:flex; gap:0; padding:0 20px;">
        <a *ngIf="userStore.role() === 'ROLE_FARMER' || userStore.role() === 'FARMER'" 
           routerLink="/crop/add" routerLinkActive="tab-active" class="tab-link">🌱 Add Crop</a>
        <a routerLink="/crop/list" routerLinkActive="tab-active" class="tab-link">🌾 View Crops</a>
        <a *ngIf="userStore.role() === 'ROLE_DEALER' || userStore.role() === 'DEALER'" 
           routerLink="/crop/subscription" routerLinkActive="tab-active" class="tab-link">🔔 Subscribe</a>
      </div>
      <div style="padding:24px;">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .tab-link {
      padding: 14px 24px; font-weight: 600; font-size: 0.95rem;
      color: #555; border-bottom: 3px solid transparent;
      transition: all 0.15s; text-decoration: none; display: inline-block;
    }
    .tab-link:hover { color: #2e7d32; background: #f9fbe7; }
    .tab-link.tab-active { color: #2e7d32; border-bottom-color: #2e7d32; }
  `]
})
export class CropLayoutComponent {
  userStore = inject(UserStore);
}
