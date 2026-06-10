import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-orders-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div>
      <div style="background:linear-gradient(to right,#e65100,#f57c00); padding:24px 28px; color:#fff; margin-bottom:0;">
        <h1 style="margin:0 0 4px; font-size:1.8rem;">📦 Order Management</h1>
        <p style="margin:0; opacity:0.85;">Create orders, view invoices, and process payments</p>
      </div>
      <div style="background:#fff; border-bottom:2px solid #e0e0e0; display:flex; gap:0; padding:0 20px;">
        <a routerLink="/orders/create" routerLinkActive="tab-active" class="tab-link">➕ Create Order</a>
        <a routerLink="/orders/history" routerLinkActive="tab-active" class="tab-link">📜 Order History</a>
        <a routerLink="/orders/invoice" routerLinkActive="tab-active" class="tab-link">🧾 Invoice</a>
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
    .tab-link:hover { color: #e65100; background: #fff3e0; }
    .tab-link.tab-active { color: #e65100; border-bottom-color: #e65100; }
  `]
})
export class OrdersLayoutComponent {}
