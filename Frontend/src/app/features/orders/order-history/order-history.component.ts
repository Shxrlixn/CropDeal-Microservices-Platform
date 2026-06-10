import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../core/services/order.service';
import { CropService } from '../../../core/services/crop.service';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1 class="page-title">📜 Order Repository</h1>
          <p class="page-subtitle">Historical log of all agricultural transactions</p>
        </div>
        <div class="header-controls">
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input type="text" [(ngModel)]="searchTerm" (input)="filterOrders()" placeholder="Search by ID, Farmer or Dealer...">
          </div>
          <button (click)="loadOrders(true)" class="btn-refresh" [disabled]="isLoading">
            <span [class.rotating]="isLoading">🔄</span>
            <span>{{ isLoading ? 'Syncing...' : 'Sync Data' }}</span>
          </button>
        </div>
      </div>

      <div *ngIf="statusMsg" class="alert alert-error">
        <span>⚠️</span> {{ statusMsg }}
      </div>

      <div class="card table-card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Order Reference</th>
                <th>Farmer Entity</th>
                <th>Dealer Entity</th>
                <th>Crop Details</th>
                <th>Quantity</th>
                <th>Transaction Value</th>
                <th>Documentation</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let o of filteredOrders" class="table-row">
                <td><span class="id-badge">#{{ (o.id || o.orderId || 'N/A').toString().substring(0,8) }}</span></td>
                <td>
                  <div class="entity-info">
                    <span class="entity-icon">🧑‍🌾</span>
                    <span class="entity-id">ID: {{ o.farmerId }}</span>
                  </div>
                </td>
                <td>
                  <div class="entity-info">
                    <span class="entity-icon">🤝</span>
                    <span class="entity-id">ID: {{ o.dealerId }}</span>
                  </div>
                </td>
                <td>
                  <div class="crop-info">
                    <span class="crop-icon">🌾</span>
                    <div class="crop-details">
                      <span class="crop-name">{{ o.cropName || getCropName(o.cropId) }}</span>
                      <small class="crop-id-sub">REF: #{{ o.cropId }}</small>
                    </div>
                  </div>
                </td>
                <td><span class="qty-badge">{{ o.quantity }} kg</span></td>
                <td><span class="price-val">₹{{ o.totalAmount || (o.quantity * o.price) }}</span></td>
                <td>
                  <button (click)="viewInvoice(o.id || o.orderId)" class="btn-invoice">
                    🧾 View Invoice
                  </button>
                </td>
              </tr>
              <tr *ngIf="filteredOrders.length === 0 && !isLoading">
                <td colspan="7" class="empty-row">
                  <div class="no-results">
                    <span>🏜️</span>
                    <p>{{ searchTerm ? 'No records match your search query' : 'Transaction registry is currently empty' }}</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 8px 0; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; gap: 20px; flex-wrap: wrap; }
    .page-title { font-size: 2rem; color: #1e293b; margin: 0 0 4px 0; font-weight: 800; }
    .page-subtitle { color: #64748b; margin: 0; }

    .header-controls { display: flex; gap: 16px; align-items: center; }
    .search-box { position: relative; background: #fff; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 0 16px; display: flex; align-items: center; width: 320px; transition: all 0.2s; }
    .search-box:focus-within { border-color: #3b82f6; box-shadow: 0 0 0 4px rgba(59,130,246,0.1); }
    .search-icon { color: #94a3b8; margin-right: 12px; }
    .search-box input { border: none; padding: 12px 0; width: 100%; outline: none; font-size: 0.9rem; font-weight: 600; }

    .btn-refresh { 
      display: flex; align-items: center; gap: 8px;
      padding: 12px 24px; background: #fff; color: #1e293b; border: 1.5px solid #e2e8f0; 
      border-radius: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s;
    }
    .btn-refresh:hover:not(:disabled) { background: #f8fafc; border-color: #cbd5e1; }
    .rotating { animation: spin 1s linear infinite; display: inline-block; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

    .card { background: #fff; border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px solid #f1f5f9; overflow: hidden; }
    .table-responsive { overflow-x: auto; }
    
    .data-table { width: 100%; border-collapse: collapse; min-width: 900px; }
    .data-table th { padding: 18px 24px; text-align: left; font-size: 0.7rem; color: #64748b; text-transform: uppercase; background: #f8fafc; border-bottom: 1px solid #f1f5f9; letter-spacing: 0.05em; font-weight: 800; }
    .data-table td { padding: 20px 24px; border-bottom: 1px solid #f8fafc; font-size: 0.9rem; }
    .table-row { transition: background 0.1s; }
    .table-row:hover { background: #f9fafb; }

    .id-badge { background: #f1f5f9; color: #475569; padding: 6px 10px; border-radius: 8px; font-weight: 700; font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; }
    
    .entity-info, .crop-info { display: flex; align-items: center; gap: 10px; }
    .entity-icon, .crop-icon { font-size: 1.2rem; }
    .entity-id, .crop-name { font-weight: 700; color: #1e293b; }
    .crop-details { display: flex; flex-direction: column; }
    .crop-id-sub { font-size: 0.7rem; color: #94a3b8; font-family: monospace; font-weight: 600; }

    .qty-badge { background: #f8fafc; border: 1px solid #e2e8f0; color: #475569; padding: 4px 10px; border-radius: 8px; font-weight: 700; font-size: 0.85rem; }
    .price-val { font-weight: 800; color: #10b981; font-size: 1.1rem; }

    .btn-invoice {
      background: #eff6ff; color: #2563eb; border: 1.5px solid #dbeafe; padding: 8px 16px;
      border-radius: 10px; font-weight: 700; cursor: pointer; transition: all 0.2s; font-size: 0.8rem;
    }
    .btn-invoice:hover { background: #2563eb; color: #fff; border-color: #2563eb; box-shadow: 0 4px 12px rgba(37,99,235,0.2); }

    .alert { padding: 16px 24px; border-radius: 12px; margin-bottom: 24px; font-weight: 700; display: flex; align-items: center; gap: 12px; }
    .alert-error { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }

    .no-results { text-align: center; padding: 60px; color: #94a3b8; }
    .no-results span { font-size: 3rem; display: block; margin-bottom: 16px; }
    .empty-row { padding: 0; }
  `]
})
export class OrderHistoryComponent implements OnInit {
  private orderService = inject(OrderService);
  private cropService = inject(CropService);
  private router = inject(Router);

  orders: any[] = [];
  crops: any[] = [];
  filteredOrders: any[] = [];
  searchTerm: string = '';
  
  isLoading = false;
  statusMsg = '';

  ngOnInit() {
    this.orderService.orders$.subscribe(data => {
      this.orders = data;
      this.filterOrders();
    });
    this.cropService.crops$.subscribe(data => {
      this.crops = data;
    });
    this.loadOrders();
    this.cropService.getAllCrops().subscribe();
  }

  loadOrders(isManual: boolean = false) {
    this.isLoading = true;
    this.statusMsg = '';
    this.orderService.getOrders(isManual).subscribe({
      next: () => this.isLoading = false,
      error: (err) => {
        this.isLoading = false;
        this.statusMsg = 'Failed to synchronize order history.';
      }
    });
  }

  filterOrders() {
    if (!this.searchTerm) {
      this.filteredOrders = [...this.orders];
    } else {
      const s = this.searchTerm.toLowerCase();
      this.filteredOrders = this.orders.filter(o => 
        (o.id || o.orderId || '').toString().toLowerCase().includes(s) ||
        (o.farmerId || '').toString().toLowerCase().includes(s) ||
        (o.dealerId || '').toString().toLowerCase().includes(s) ||
        (o.cropId || '').toString().toLowerCase().includes(s)
      );
    }
  }

  getCropName(id: any): string {
    const crop = this.crops.find(c => c.id.toString() === id.toString());
    return crop ? (crop.cropName || crop.name) : 'Produce Stock';
  }

  viewInvoice(orderId: any) {
    this.router.navigate(['/orders/invoice'], { queryParams: { id: orderId } });
  }
}
