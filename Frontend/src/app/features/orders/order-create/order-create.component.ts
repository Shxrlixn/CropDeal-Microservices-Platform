import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { CropService } from '../../../core/services/crop.service';
import { FarmerService } from '../../../core/services/farmer.service';
import { DealerService } from '../../../core/services/dealer.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">🌾 Create New Order</h1>
        <p class="page-subtitle">Configure and finalize a secure agricultural transaction.</p>
      </div>

      <div class="order-grid">
        <!-- Input Form -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">📝 Order Details</h3>
          </div>
          <div class="card-body">
            <div *ngIf="statusMsg" class="alert" [class.alert-success]="!isError" [class.alert-error]="isError">
              {{ statusMsg }}
            </div>

            <div class="form-section">
              <div class="form-group">
                <label>Select Crop</label>
                <div class="input-wrapper">
                  <span class="input-icon">🌾</span>
                  <select [(ngModel)]="order.cropId" (change)="onCropSelect()" class="form-control select-control">
                    <option value="" disabled selected>Choose a crop...</option>
                    <option *ngFor="let c of crops" [value]="c.id">
                      {{ c.cropName || c.name }} (#{{ c.id }})
                    </option>
                  </select>
                  <span class="select-arrow">▼</span>
                </div>
              </div>

              <div class="form-group">
                <label>Dealer (Buyer)</label>
                <div class="input-wrapper">
                  <span class="input-icon">🤝</span>
                  <select [(ngModel)]="order.dealerId" (change)="onDealerSelect()" class="form-control select-control">
                    <option value="" disabled selected>Choose a dealer...</option>
                    <option *ngFor="let d of dealers" [value]="d.id">
                      {{ d.name || d.username }} (#{{ d.id }})
                    </option>
                  </select>
                  <span class="select-arrow">▼</span>
                </div>
              </div>

              <div class="form-group">
                <label>Linked Farmer</label>
                <div class="input-wrapper">
                  <span class="input-icon">🧑‍🌾</span>
                  <input type="text" [value]="selectedFarmerName || 'Select a crop first'" disabled class="form-control">
                </div>
              </div>

              <div class="form-group">
                <label>Order Quantity (kg)</label>
                <div class="input-wrapper">
                  <span class="input-icon">⚖️</span>
                  <input type="number" [(ngModel)]="order.quantity" class="form-control" placeholder="0">
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary Card -->
        <div class="card summary-card">
          <div class="card-header summary-header">
            <h3 class="card-title summary-title">📦 Transaction Summary</h3>
          </div>
          <div class="summary-content">
            <div class="summary-item">
              <span>Selected Crop:</span>
              <span class="val">{{ selectedCropName || '---' }}</span>
            </div>
            <div class="summary-item">
              <span>Unit Price:</span>
              <span class="val">₹{{ order.price }}/kg</span>
            </div>
            <div class="summary-item">
              <span>Quantity:</span>
              <span class="val">{{ order.quantity || 0 }} kg</span>
            </div>
            <div class="summary-item">
              <span>Dealer:</span>
              <span class="val">{{ selectedDealerName || '---' }}</span>
            </div>

            <div class="summary-divider"></div>

            <div class="total-row">
              <span class="total-label">Total Payable:</span>
              <div class="total-val"><span>₹</span>{{ (order.quantity || 0) * (order.price || 0) }}</div>
            </div>

            <button (click)="placeOrder()" class="btn-submit" 
                    [disabled]="isLoading || !order.cropId || !order.dealerId || order.quantity <= 0"
                    [class.success]="purchaseSuccess">
              <span *ngIf="!isLoading && !purchaseSuccess">🚀 Confirm Order</span>
              <span *ngIf="isLoading" class="spinner"></span>
              <span *ngIf="purchaseSuccess">✅ Order Finalized</span>
            </button>

            <a (click)="goToHistory()" class="history-link" style="cursor: pointer;">
              View All Orders ➜
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { max-width: 900px; margin: 0 auto; padding: 20px 0; }
    .page-header { margin-bottom: 32px; text-align: center; }
    .page-title { font-size: 2.4rem; color: #1a237e; margin-bottom: 8px; font-weight: 800; }
    .page-subtitle { color: #64748b; font-size: 1.1rem; margin: 0; }

    .order-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 32px; }
    @media (max-width: 900px) { .order-grid { grid-template-columns: 1fr; } }

    .card { background: #fff; border-radius: 24px; box-shadow: 0 10px 40px rgba(0,0,0,0.06); border: 1px solid #f1f5f9; overflow: hidden; }
    .card-header { padding: 24px 32px; border-bottom: 1px solid #f1f5f9; background: #fafbfc; }
    .card-title { margin: 0; font-size: 1.2rem; color: #1e293b; font-weight: 800; display: flex; align-items: center; gap: 12px; }
    
    .card-body { padding: 32px; }
    .form-section { display: flex; flex-direction: column; gap: 24px; }
    
    .form-group label { display: block; font-size: 0.75rem; font-weight: 800; color: #64748b; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.05em; }
    .input-wrapper { position: relative; display: flex; align-items: center; }
    .input-icon { position: absolute; left: 16px; color: #94a3b8; font-size: 1.1rem; }
    .form-control { width: 100%; padding: 14px 16px 14px 48px; border: 2px solid #e2e8f0; border-radius: 12px; font-size: 1rem; font-weight: 600; color: #1e293b; transition: all 0.2s; background: #f8fafc; }
    .form-control:focus { border-color: #3b82f6; outline: none; background: #fff; box-shadow: 0 0 0 4px rgba(59,130,246,0.1); }
    
    .select-control { appearance: none; cursor: pointer; }
    .select-arrow { position: absolute; right: 16px; color: #94a3b8; pointer-events: none; }

    .summary-card { background: linear-gradient(135deg, #1e293b, #0f172a); color: #fff; border: none; }
    .summary-header { border-bottom: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.03); }
    .summary-title { color: #f8fafc; }
    
    .summary-content { padding: 32px; }
    .summary-item { display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 0.95rem; color: #94a3b8; }
    .summary-item .val { color: #f8fafc; font-weight: 700; }
    .summary-divider { height: 1px; background: rgba(255,255,255,0.1); margin: 20px 0; }
    
    .total-row { display: flex; justify-content: space-between; align-items: baseline; margin-top: 10px; }
    .total-label { font-size: 1.1rem; font-weight: 800; color: #f8fafc; }
    .total-val { font-size: 2.2rem; font-weight: 900; color: #3b82f6; }
    .total-val span { font-size: 1.2rem; margin-right: 4px; }

    .btn-submit { 
      width: 100%; padding: 18px; background: #3b82f6; 
      color: #fff; border: none; border-radius: 16px; font-size: 1.1rem; font-weight: 800; 
      cursor: pointer; transition: all 0.3s; margin-top: 24px;
      display: flex; align-items: center; justify-content: center; gap: 12px;
    }
    .btn-submit:hover:not(:disabled) { background: #2563eb; transform: translateY(-2px); box-shadow: 0 10px 25px rgba(59,130,246,0.4); }
    .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-submit.success { background: #10b981; }

    .alert { padding: 16px 20px; border-radius: 14px; margin-bottom: 24px; font-weight: 700; font-size: 0.95rem; display: flex; align-items: center; gap: 12px; }
    .alert-success { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; }
    .alert-error { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }

    .spinner { width: 20px; height: 20px; border: 3px solid rgba(255,255,255,0.3); border-radius: 50%; border-top-color: #fff; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .history-link { display: block; text-align: center; margin-top: 20px; color: #94a3b8; font-weight: 700; text-decoration: none; font-size: 0.9rem; transition: color 0.2s; }
    .history-link:hover { color: #f8fafc; }
  `]
})
export class OrderCreateComponent implements OnInit, OnDestroy {
  private orderService = inject(OrderService);
  private cropService = inject(CropService);
  private farmerService = inject(FarmerService);
  private dealerService = inject(DealerService);
  private router = inject(Router);
  private sub = new Subscription();

  crops: any[] = [];
  farmers: any[] = [];
  dealers: any[] = [];

  order = {
    cropId: '',
    farmerId: '',
    dealerId: '',
    quantity: 0,
    price: 0
  };

  selectedCropName = '';
  selectedFarmerName = '';
  selectedDealerName = '';

  isLoading = false;
  statusMsg = '';
  isError = false;
  purchaseSuccess = false;

  ngOnInit() {
    // ── Pre-fetch Hub Data for Seamless Selection ────────────────────────────
    this.sub.add(this.cropService.crops$.subscribe(data => this.crops = data));
    this.sub.add(this.farmerService.farmers$.subscribe(data => this.farmers = data));
    this.sub.add(this.dealerService.dealers$.subscribe(data => this.dealers = data));

    this.cropService.getAllCrops().subscribe();
    this.farmerService.getAllFarmers().subscribe();
    this.dealerService.getAllDealers().subscribe();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onCropSelect() {
    const crop = this.crops.find(c => c.id.toString() === this.order.cropId.toString());
    if (crop) {
      this.selectedCropName = crop.cropName || crop.name;
      this.order.price = crop.price;
      this.order.farmerId = crop.farmerId;
      this.onFarmerSelect(); // Auto-select farmer linked to crop
    }
  }

  onFarmerSelect() {
    const farmer = this.farmers.find(f => f.id.toString() === this.order.farmerId.toString());
    this.selectedFarmerName = farmer ? (farmer.name || farmer.username) : '';
  }

  onDealerSelect() {
    const dealer = this.dealers.find(d => d.id.toString() === this.order.dealerId.toString());
    this.selectedDealerName = dealer ? (dealer.name || dealer.username) : '';
  }

  placeOrder() {
    if (!this.order.cropId || !this.order.dealerId || !this.order.quantity || !this.order.price) {
      this.statusMsg = 'Please ensure all required fields are populated.';
      this.isError = true;
      return;
    }

    this.isLoading = true;
    this.statusMsg = '';
    this.purchaseSuccess = false;
    
    const payload = {
      cropId: Number(this.order.cropId),
      cropName: this.selectedCropName,
      farmerId: Number(this.order.farmerId),
      dealerId: Number(this.order.dealerId),
      quantity: Number(this.order.quantity),
      price: Number(this.order.price)
    };

    this.orderService.createOrder(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.isError = false;
        this.purchaseSuccess = true;
        const id = res.id || res.orderId || 'N/A';
        this.statusMsg = `✨ Order #${id} finalized successfully!`;
        
        // Reset form
        this.order = { cropId: '', farmerId: '', dealerId: '', quantity: 0, price: 0 };
        this.selectedCropName = '';
        this.selectedFarmerName = '';
        this.selectedDealerName = '';

        setTimeout(() => {
          this.purchaseSuccess = false;
          this.statusMsg = '';
        }, 5000);
      },
      error: (err) => {
        this.isLoading = false;
        this.isError = true;
        this.statusMsg = '⚠️ Transaction failed. Please verify availability.';
      }
    });
  }

  goToHistory() {
    this.router.navigate(['/orders/history']);
  }
}
