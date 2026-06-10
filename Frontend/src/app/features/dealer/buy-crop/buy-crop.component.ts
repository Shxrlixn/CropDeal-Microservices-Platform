import { Component, inject, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DealerService } from '../../../core/services/dealer.service';
import { Subscription } from 'rxjs';
import { Crop } from '../../../shared/models/crop.model';

@Component({
  selector: 'app-dealer-buy',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1 class="page-title">🛒 Marketplace: Buy Crops</h1>
          <p class="page-subtitle">Browse available listings and secure your inventory.</p>
        </div>
        <div class="header-controls">
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input type="text" [(ngModel)]="searchTerm" (input)="filterCrops()" placeholder="Search by name or ID...">
          </div>
          <button (click)="loadCrops()" class="btn-refresh" [disabled]="loadingCrops">
            <span [class.rotating]="loadingCrops">🔄</span>
            <span>{{ loadingCrops ? 'Refreshing...' : 'Refresh' }}</span>
          </button>
        </div>
      </div>

      <div class="buy-grid">
        <!-- Crop Table Card -->
        <div class="card table-card">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Crop Name</th>
                  <th>Price</th>
                  <th>Available</th>
                  <th>Farmer</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let c of filteredCrops; trackBy: trackByCropId" 
                    [class.selected-row]="selectedCropId === c.id"
                    (click)="selectCrop(c)">
                  <td><span class="id-badge">#{{ c.id }}</span></td>
                  <td class="name-cell">
                    <div class="crop-info">
                      <span class="crop-icon">🌾</span>
                      <span>{{ c.cropName || c.name }}</span>
                    </div>
                  </td>
                  <td class="price-cell">₹{{ c.price }}<span class="unit">/kg</span></td>
                  <td>
                    <div class="stock-display">
                      <span class="qty-badge" [class.low-stock]="(c.quantity || 0) < 50">
                        {{ c.quantity || 0 }} kg
                      </span>
                      <div class="mini-bar"><div class="mini-bar-fill" [style.width.%]="Math.min(100, (c.quantity / 500) * 100)"></div></div>
                    </div>
                  </td>
                  <td><span class="farmer-id">#{{ c.farmerId }}</span></td>
                  <td>
                    <button class="btn-select" [class.active]="selectedCropId === c.id">
                      {{ selectedCropId === c.id ? 'Selected' : 'Select' }}
                    </button>
                  </td>
                </tr>
                <tr *ngIf="filteredCrops.length === 0 && !loadingCrops">
                  <td colspan="6" class="empty-row">
                    <div class="no-results">
                      <span>🏜️</span>
                      <p>{{ searchTerm ? 'No crops match your search' : 'No crops available at the moment' }}</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Purchase Panel -->
        <div class="card purchase-card" [class.has-selection]="selectedCropId">
          <div class="panel-header">
            <h3 class="panel-title">📦 Purchase Summary</h3>
            <span *ngIf="selectedCropId" class="selection-tag">Active Selection</span>
          </div>
          
          <div class="purchase-body">
            <div *ngIf="message" class="alert" [class.alert-success]="!isError" [class.alert-error]="isError">
              {{ message }}
            </div>

            <div class="form-group">
              <label>Selected Crop</label>
              <div class="selection-display" [class.placeholder]="!selectedCropId">
                <span class="display-name">{{ selectedCropName || 'Select a crop from the table' }}</span>
                <span *ngIf="selectedCropId" class="id-sub">#{{ selectedCropId }}</span>
              </div>
            </div>

            <div class="form-group">
              <label for="qtyInput">Purchase Quantity (kg)</label>
              <div class="qty-input-wrapper">
                <input type="number" id="qtyInput" #qtyInput [(ngModel)]="quantity" 
                       class="form-control" placeholder="0"
                       [disabled]="!selectedCropId">
                <span class="qty-unit">kg</span>
              </div>
              <div class="qty-presets" *ngIf="selectedCropId">
                <button (click)="quantity = 10">10</button>
                <button (click)="quantity = 50">50</button>
                <button (click)="quantity = 100">100</button>
              </div>
            </div>

            <div class="summary-box" *ngIf="selectedCropId">
              <div class="summary-row">
                <span>Unit Price:</span>
                <span class="val">₹{{ selectedPrice }}/kg</span>
              </div>
              <div class="summary-row total">
                <span>Total Payable:</span>
                <span class="total-price">₹{{ (quantity || 0) * selectedPrice }}</span>
              </div>
            </div>

            <button (click)="buyCrop()" class="btn-buy" 
                    [disabled]="processingBuy || !selectedCropId || quantity <= 0"
                    [class.processing]="processingBuy"
                    [class.success]="purchaseSuccess">
              <span *ngIf="!processingBuy && !purchaseSuccess">💳 Secure Purchase</span>
              <span *ngIf="processingBuy" class="loader-inline"></span>
              <span *ngIf="processingBuy">Processing...</span>
              <span *ngIf="purchaseSuccess">✅ Order Placed!</span>
            </button>
            
            <p class="hint" *ngIf="!selectedCropId">Select a crop from the marketplace to continue</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 8px 0; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 28px; gap: 20px; flex-wrap: wrap; }
    .page-title { font-size: 1.8rem; color: #1b5e20; margin: 0 0 4px 0; }
    .page-subtitle { color: #666; margin: 0; }

    .header-controls { display: flex; gap: 16px; align-items: center; }
    .search-box { position: relative; background: #fff; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 0 12px; display: flex; align-items: center; width: 280px; transition: all 0.2s; }
    .search-box:focus-within { border-color: #2e7d32; box-shadow: 0 0 0 3px rgba(46,125,50,0.1); }
    .search-icon { color: #a0aec0; margin-right: 8px; font-size: 0.9rem; }
    .search-box input { border: none; padding: 10px 0; width: 100%; outline: none; font-size: 0.9rem; }

    .btn-refresh { 
       display: flex; align-items: center; gap: 8px;
       padding: 10px 20px; background: #fff; color: #2e7d32; border: 1.5px solid #a5d6a7; 
       border-radius: 10px; font-weight: 700; cursor: pointer; transition: all 0.2s;
    }
    .btn-refresh:hover:not(:disabled) { background: #f1f8e9; }
    .rotating { animation: spin 1s linear infinite; display: inline-block; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

    .buy-grid { display: grid; grid-template-columns: 1fr 380px; gap: 24px; align-items: start; }
    @media (max-width: 1100px) { .buy-grid { grid-template-columns: 1fr; } }

    .card { background: #fff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #edf2f7; overflow: hidden; }
    .panel-header { display: flex; justify-content: space-between; align-items: center; padding-right: 20px; border-bottom: 1px solid #f7fafc; background: #fafdfb; }
    .panel-title { padding: 16px 20px; margin: 0; font-size: 1rem; color: #2d3748; font-weight: 800; }
    .selection-tag { background: #ebf8ff; color: #3182ce; font-size: 0.7rem; font-weight: 800; padding: 4px 8px; border-radius: 20px; }

    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th { padding: 16px; text-align: left; font-size: 0.7rem; color: #718096; text-transform: uppercase; background: #f7fafc; border-bottom: 1px solid #edf2f7; letter-spacing: 0.05em; }
    .data-table td { padding: 14px 16px; border-bottom: 1px solid #f7fafc; font-size: 0.92rem; cursor: pointer; transition: background 0.1s; }
    .data-table tbody tr:hover { background: #f9fafb; }
    .selected-row { background: #f0fff4 !important; }
    .selected-row td { border-bottom-color: #c6f6d5; }

    .id-badge { background: #edf2f7; padding: 4px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; color: #4a5568; }
    .crop-info { display: flex; align-items: center; gap: 10px; font-weight: 700; color: #2d3748; }
    .crop-icon { font-size: 1.1rem; }
    .price-cell { color: #38a169; font-weight: 800; font-size: 1rem; }
    .unit { font-size: 0.75rem; opacity: 0.7; font-weight: 400; }

    .stock-display { display: flex; flex-direction: column; gap: 4px; min-width: 80px; }
    .qty-badge { font-weight: 700; color: #4a5568; font-size: 0.85rem; }
    .low-stock { color: #e53e3e; }
    .mini-bar { height: 4px; background: #edf2f7; border-radius: 2px; width: 60px; overflow: hidden; }
    .mini-bar-fill { height: 100%; background: #48bb78; border-radius: 2px; }

    .farmer-id { font-size: 0.8rem; background: #ebf4ff; color: #3182ce; padding: 2px 8px; border-radius: 6px; font-weight: 600; }

    .btn-select { 
      padding: 6px 12px; background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; 
      cursor: pointer; font-size: 0.8rem; font-weight: 700; color: #4a5568; transition: all 0.2s;
    }
    .btn-select.active { background: #38a169; color: #fff; border-color: #38a169; }

    .purchase-body { padding: 24px; }
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; font-size: 0.75rem; font-weight: 800; color: #718096; margin-bottom: 8px; text-transform: uppercase; }
    
    .selection-display { 
      background: #f7fafc; padding: 12px; border-radius: 12px; border: 2px dashed #e2e8f0;
      display: flex; justify-content: space-between; align-items: center;
    }
    .display-name { font-weight: 800; color: #2d3748; }
    .selection-display.placeholder .display-name { color: #a0aec0; font-weight: 500; }
    .id-sub { font-size: 0.7rem; background: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-weight: 700; }

    .qty-input-wrapper { position: relative; display: flex; align-items: center; }
    .qty-input-wrapper input { width: 100%; padding: 12px; border: 2px solid #e2e8f0; border-radius: 10px; font-size: 1rem; font-weight: 700; outline: none; }
    .qty-input-wrapper input:focus { border-color: #38a169; }
    .qty-unit { position: absolute; right: 12px; color: #a0aec0; font-weight: 700; font-size: 0.9rem; pointer-events: none; }

    .qty-presets { display: flex; gap: 8px; margin-top: 8px; }
    .qty-presets button { background: #f7fafc; border: 1px solid #e2e8f0; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; cursor: pointer; color: #4a5568; }
    .qty-presets button:hover { background: #edf2f7; color: #2d3748; }

    .summary-box { background: #f0fff4; padding: 16px; border-radius: 12px; margin: 20px 0; border: 1px solid #c6f6d5; }
    .summary-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.9rem; color: #4a5568; }
    .summary-row.total { font-weight: 800; color: #276749; border-top: 1px solid #c6f6d5; padding-top: 10px; font-size: 1rem; margin-top: 4px; }
    .total-price { font-size: 1.2rem; }

    .btn-buy { 
      width: 100%; padding: 14px; background: #2f855a; 
      color: #fff; border: none; border-radius: 10px; font-weight: 800; font-size: 1rem;
      cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 10px;
    }
    .btn-buy:hover:not(:disabled) { transform: translateY(-2px); background: #276749; box-shadow: 0 4px 12px rgba(47,133,90,0.3); }
    .btn-buy:disabled { opacity: 0.4; cursor: not-allowed; }
    .btn-buy.success { background: #38a169; }

    .loader-inline { width: 18px; height: 18px; border: 2.5px solid rgba(255,255,255,0.3); border-radius: 50%; border-top-color: #fff; animation: spin 0.8s linear infinite; }

    .alert { padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 0.85rem; font-weight: 700; text-align: center; }
    .alert-success { background: #f0fff4; color: #276749; border: 1px solid #c6f6d5; }
    .alert-error { background: #fff5f5; color: #c53030; border: 1px solid #feb2b2; }

    .no-results { text-align: center; padding: 40px; color: #a0aec0; }
    .no-results span { font-size: 2rem; display: block; margin-bottom: 10px; }
    .empty-row { padding: 60px; }
    .hint { text-align: center; font-size: 0.75rem; color: #a0aec0; margin-top: 12px; font-weight: 600; }
  `]
})
export class DealerBuyComponent implements OnInit, OnDestroy {
  private dealerService = inject(DealerService);
  private sub = new Subscription();
  protected Math = Math;
  
  @ViewChild('qtyInput') qtyInput!: ElementRef;

  crops: Crop[] = [];
  filteredCrops: Crop[] = [];
  searchTerm: string = '';

  selectedCropId: string | null = null;
  selectedCropName: string = '';
  selectedPrice: number = 0;
  quantity: number = 0;
  
  loadingCrops = false;
  processingBuy = false;
  purchaseSuccess = false;
  message = '';
  isError = false;

  ngOnInit() {
    this.sub.add(
      this.dealerService.crops$.subscribe(data => {
        if (data) {
          this.crops = data as Crop[];
          this.filterCrops();
        }
      })
    );
    this.loadCrops();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  loadCrops() {
    this.loadingCrops = true;
    this.message = '';
    this.dealerService.getCrops().subscribe({
      next: () => {
        this.loadingCrops = false;
      },
      error: (err) => {
        this.loadingCrops = false;
        if (this.crops.length === 0) {
          this.isError = true;
          this.message = 'Failed to load crops. API Gateway might be down.';
        }
      }
    });
  }

  filterCrops() {
    if (!this.searchTerm) {
      this.filteredCrops = [...this.crops];
    } else {
      const s = this.searchTerm.toLowerCase();
      this.filteredCrops = this.crops.filter(c => 
        (c.cropName || (c as any).name || '').toLowerCase().includes(s) || 
        (c.id || '').toString().includes(s)
      );
    }
  }

  selectCrop(crop: Crop) {
    const cropId = crop.id || '';
    if (this.selectedCropId === cropId) return;
    
    this.selectedCropId = cropId;
    this.selectedCropName = crop.cropName || (crop as any).name;
    this.selectedPrice = crop.price;
    this.message = '';
    this.purchaseSuccess = false;
    
    setTimeout(() => {
      this.qtyInput?.nativeElement?.focus();
    }, 50);
  }

  buyCrop() {
    if (!this.selectedCropId || this.quantity <= 0) {
      this.message = 'Please enter valid crop and quantity';
      this.isError = true;
      return;
    }

    const buyQty = this.quantity;
    const targetId = this.selectedCropId;

    this.processingBuy = true;
    this.message = '';
    this.purchaseSuccess = false;

    // --- OPTIMISTIC UPDATE ---
    const originalCrops = JSON.parse(JSON.stringify(this.crops));
    this.crops = this.crops.map(c => 
      c.id === targetId ? { ...c, quantity: (c.quantity || 0) - buyQty } : c
    );
    this.filterCrops();

    this.dealerService.buyCrop(targetId, buyQty).subscribe({
      next: () => {
        this.processingBuy = false;
        this.purchaseSuccess = true;
        this.isError = false;
        this.message = 'Purchase successful!';
        
        this.selectedCropId = null;
        this.selectedCropName = '';
        this.quantity = 0;

        setTimeout(() => {
          this.purchaseSuccess = false;
          this.message = '';
        }, 3000);
      },
      error: () => {
        this.processingBuy = false;
        this.isError = true;
        this.message = 'Purchase failed. Rolling back...';
        this.crops = originalCrops;
        this.filterCrops();
      }
    });
  }

  trackByCropId(index: number, crop: Crop) {
    return crop.id;
  }
}



