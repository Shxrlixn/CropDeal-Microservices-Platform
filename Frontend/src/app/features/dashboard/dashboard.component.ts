import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CropService } from '../../core/services/crop.service';
import { FarmerService } from '../../core/services/farmer.service';
import { OrderService } from '../../core/services/order.service';
import { DealerService } from '../../core/services/dealer.service';
import { UserStore } from '../../core/services/user.store';
import { forkJoin, catchError, of, finalize, Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-root">
      <!-- Sophisticated Top Navigation Space -->
      <header class="dashboard-header">
        <div class="title-section">
          <h1 class="main-title">
            Welcome, <span class="accent-text">{{ userStore.role() || 'User' }}</span>
          </h1>
          <div class="breadcrumb">
            <span>CropDeal Platform</span>
            <span class="sep">/</span>
            <span class="active">Dashboard</span>
          </div>
        </div>
        <div class="user-profile-mini">
          <div class="role-badge">{{ userStore.role() || 'MEMBER' }}</div>
          <button (click)="loadAll()" [disabled]="isLoading" class="btn-sync">
            <span [class.rotating]="isLoading">{{ isLoading ? '⌛' : '🔄' }}</span>
            {{ isLoading ? 'Syncing...' : 'Sync Hub' }}
          </button>
        </div>
      </header>

      <!-- Status Hub -->
      <div *ngIf="statusMessage" class="status-overlay" [class.success]="statusType === 'success'" [class.error]="statusType === 'error'">
        <div class="status-content">
          <span class="status-indicator"></span>
          <span class="status-text">{{ statusMessage }}</span>
        </div>
        <button (click)="statusMessage = ''" class="status-close">×</button>
      </div>

      <!-- Metrics Matrix -->
      <div class="metrics-matrix">
        
        <!-- ADMIN METRICS -->
        <ng-container *ngIf="userStore.role() === 'ADMIN' || userStore.role() === 'ROLE_ADMIN'">
          <div class="metric-box emerald">
            <div class="box-inner">
              <div class="metric-icon">🌱</div>
              <div class="metric-data">
                <span class="metric-label">Total Crops</span>
                <h2 class="metric-value">{{ crops.length }}</h2>
              </div>
            </div>
          </div>
          <div class="metric-box indigo">
            <div class="box-inner">
              <div class="metric-icon">🚜</div>
              <div class="metric-data">
                <span class="metric-label">Total Farmers</span>
                <h2 class="metric-value">{{ farmers.length }}</h2>
              </div>
            </div>
          </div>
          <div class="metric-box slate">
            <div class="box-inner">
              <div class="metric-icon">🏢</div>
              <div class="metric-data">
                <span class="metric-label">Total Dealers</span>
                <h2 class="metric-value">{{ dealers.length }}</h2>
              </div>
            </div>
          </div>
          <div class="metric-box slate">
            <div class="box-inner">
              <div class="metric-icon">📦</div>
              <div class="metric-data">
                <span class="metric-label">Total Orders</span>
                <h2 class="metric-value">{{ orders.length }}</h2>
              </div>
            </div>
          </div>
        </ng-container>

        <!-- FARMER METRICS -->
        <ng-container *ngIf="userStore.role() === 'ROLE_FARMER' || userStore.role() === 'FARMER'">
          <div class="metric-box emerald">
            <div class="box-inner">
              <div class="metric-icon">🌾</div>
              <div class="metric-data">
                <span class="metric-label">My Crops</span>
                <h2 class="metric-value">{{ crops.length }}</h2>
              </div>
            </div>
          </div>
          <div class="metric-box indigo">
            <div class="box-inner">
              <div class="metric-icon">📋</div>
              <div class="metric-data">
                <span class="metric-label">Crop Listings</span>
                <h2 class="metric-value">{{ crops.length }}</h2>
              </div>
            </div>
          </div>
          <div class="metric-box slate">
            <div class="box-inner">
              <div class="metric-icon">✨</div>
              <div class="metric-data">
                <span class="metric-label">Active Crops</span>
                <h2 class="metric-value">{{ crops.length }}</h2>
              </div>
            </div>
          </div>
        </ng-container>

        <!-- DEALER METRICS -->
        <ng-container *ngIf="userStore.role() === 'ROLE_DEALER' || userStore.role() === 'DEALER'">
          <div class="metric-box emerald">
            <div class="box-inner">
              <div class="metric-icon">🛒</div>
              <div class="metric-data">
                <span class="metric-label">Available Crops</span>
                <h2 class="metric-value">{{ crops.length }}</h2>
              </div>
            </div>
          </div>
          <div class="metric-box indigo">
            <div class="box-inner">
              <div class="metric-icon">📦</div>
              <div class="metric-data">
                <span class="metric-label">Orders Created</span>
                <h2 class="metric-value">{{ orders.length }}</h2>
              </div>
            </div>
          </div>
          <div class="metric-box slate">
            <div class="box-inner">
              <div class="metric-icon">💰</div>
              <div class="metric-data">
                <span class="metric-label">Purchase Summary</span>
                <h2 class="metric-value">View All</h2>
              </div>
            </div>
          </div>
        </ng-container>

      </div>

    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=JetBrains+Mono:wght@500&display=swap');

    .dashboard-root {
      padding: 40px;
      background: #0f172a;
      min-height: 100vh;
      color: #f8fafc;
      font-family: 'Outfit', sans-serif;
    }

    /* Header Styling */
    .dashboard-header {
      display: flex; justify-content: space-between; align-items: flex-start;
      margin-bottom: 50px;
    }
    .main-title { font-size: 2.5rem; font-weight: 800; margin: 0; color: #fff; letter-spacing: -1.5px; }
    .accent-text { color: #10b981; }
    .breadcrumb { display: flex; align-items: center; gap: 10px; margin-top: 8px; font-size: 0.9rem; color: #64748b; font-weight: 600; }
    .sep { opacity: 0.3; }
    .breadcrumb .active { color: #94a3b8; }

    .user-profile-mini { display: flex; align-items: center; gap: 20px; }
    .role-badge { background: rgba(255,255,255,0.05); padding: 8px 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); font-weight: 800; font-size: 0.8rem; color: #10b981; }
    
    .btn-sync {
      background: #10b981; color: #000; border: none; padding: 12px 24px;
      border-radius: 12px; font-weight: 800; cursor: pointer; display: flex;
      align-items: center; gap: 10px; transition: all 0.3s;
    }
    .btn-sync:hover:not(:disabled) { background: #34d399; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(16,185,129,0.2); }
    .rotating { display: inline-block; animation: spin 1s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

    /* Status Hub */
    .status-overlay {
      position: fixed; top: 30px; right: 30px;
      background: #1e293b; border: 1px solid rgba(255,255,255,0.1);
      padding: 16px 24px; border-radius: 16px; display: flex;
      align-items: center; gap: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.3);
      animation: slideIn 0.5s cubic-bezier(0.19, 1, 0.22, 1); z-index: 2000;
    }
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    .status-indicator { width: 10px; height: 10px; border-radius: 50%; background: #10b981; box-shadow: 0 0 10px #10b981; }
    .status-text { font-weight: 700; color: #fff; font-size: 0.95rem; }
    .status-close { background: none; border: none; color: #64748b; font-size: 1.2rem; cursor: pointer; }

    /* Metrics Matrix */
    .metrics-matrix { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px; margin-bottom: 50px; }
    .metric-box {
      border-radius: 24px; padding: 40px; position: relative; overflow: hidden;
      background: rgba(30, 41, 59, 0.5); border: 1px solid rgba(255,255,255,0.05);
      transition: all 0.4s;
    }
    .metric-box:hover { transform: translateY(-8px); border-color: rgba(255,255,255,0.15); background: rgba(30, 41, 59, 0.8); }
    
    .box-inner { display: flex; flex-direction: column; height: 100%; }
    .metric-icon { font-size: 2.5rem; margin-bottom: 24px; }
    .metric-label { display: block; color: #94a3b8; font-weight: 800; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 1.5px; }
    .metric-value { font-size: 3.5rem; font-weight: 800; margin: 8px 0 0; color: #fff; line-height: 1; }

    .metric-graph { display: flex; align-items: flex-end; gap: 8px; height: 50px; margin-top: 32px; opacity: 0.2; }
    .bar { width: 10px; border-radius: 5px; background: currentColor; }

    .emerald { color: #10b981; }
    .indigo { color: #6366f1; }
    .slate { color: #94a3b8; }

    .syncing .metric-value { opacity: 0.2; animation: pulse 1s infinite; }
    @keyframes pulse { 0% { opacity: 0.2; } 50% { opacity: 0.4; } 100% { opacity: 0.2; } }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  private cropService = inject(CropService);
  private farmerService = inject(FarmerService);
  private orderService = inject(OrderService);
  private dealerService = inject(DealerService);
  userStore = inject(UserStore);
  private sub = new Subscription();

  crops: any[] = [];
  farmers: any[] = [];
  orders: any[] = [];
  dealers: any[] = [];
  
  isLoading = false;
  statusMessage = '';
  statusType: 'success' | 'error' = 'success';

  ngOnInit() {
    // ── Reactive Hub Synchronization ─────────────────────────────────────────
    // Subscribe to all core streams for real-time dashboard updates
    this.sub.add(this.cropService.crops$.subscribe(data => this.crops = data));
    this.sub.add(this.farmerService.farmers$.subscribe(data => this.farmers = data));
    this.sub.add(this.orderService.orders$.subscribe(data => this.orders = data));
    this.sub.add(this.dealerService.dealers$.subscribe(data => this.dealers = data));

    // Initial silent load
    this.loadAll(true);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  /**
   * Triggers a global refresh of all hub services.
   * @param silent If true, suppresses loading indicators and success messages.
   */
  loadAll(silent: boolean = false) {
    if (!silent) this.isLoading = true;
    
    // Fire-and-forget refreshes; the subscriptions in ngOnInit handle the data
    forkJoin({
      crops: this.cropService.getAllCrops().pipe(catchError(() => of([]))),
      orders: this.orderService.getOrders(true).pipe(catchError(() => of([]))),
      farmers: this.farmerService.getAllFarmers().pipe(catchError(() => of([]))),
      dealers: this.dealerService.getAllDealers().pipe(catchError(() => of([])))
    }).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: () => {
        if (!silent) this.showStatus("Hub synchronization complete. ✨", "success");
      },
      error: (err) => {
        console.error("[DASHBOARD] Sync failed", err);
        if (!silent) this.showStatus("Synchronization warning.", "error");
      }
    });
  }

  private showStatus(msg: string, type: 'success' | 'error') {
    this.statusMessage = msg;
    this.statusType = type;
    setTimeout(() => this.statusMessage = '', 4000);
  }
}
