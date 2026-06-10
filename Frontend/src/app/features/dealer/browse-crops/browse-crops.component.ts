import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CropService } from '../../../core/services/crop.service';
import { Subscription } from 'rxjs';
import { Crop } from '../../../shared/models/crop.model';

@Component({
  selector: 'app-browse-crops',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="list-header">
        <div>
          <h1 class="page-title">🌾 Crop Marketplace</h1>
          <p class="page-subtitle">Explore available agricultural produce in real-time</p>
        </div>
        <div class="header-controls">
          <div class="search-bar">
            <span class="search-icon">🔍</span>
            <input type="text" [(ngModel)]="searchTerm" (input)="filterCrops()" placeholder="Search crops...">
          </div>
          <button (click)="loadCrops()" [disabled]="isLoading" class="btn-load">
            <span *ngIf="!isLoading">🔄 Sync Hub</span>
            <span *ngIf="isLoading" class="loading-dots">Syncing<span>.</span><span>.</span><span>.</span></span>
          </button>
        </div>
      </div>

      <div *ngIf="message" class="alert alert-info">{{ message }}</div>

      <div class="marketplace-grid">
        <div *ngFor="let crop of filteredCrops; trackBy: trackByCropId" class="crop-card-premium">
          <div class="card-header">
            <div class="crop-tag">{{ crop.category || 'FRESH' }}</div>
            <span class="crop-emoji">🥗</span>
          </div>
          <div class="card-content">
            <h3 class="crop-name">{{ crop.cropName || crop.name }}</h3>
            <div class="price-row">
              <span class="price-val">₹{{ crop.price }}</span>
              <span class="price-unit">/ kg</span>
            </div>
            
            <div class="meta-grid">
              <div class="meta-item">
                <span class="meta-label">Stock</span>
                <span class="meta-value highlight">{{ crop.quantity }} kg</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Farmer</span>
                <span class="meta-value">#{{ crop.farmerId }}</span>
              </div>
            </div>

            <div class="stock-progress">
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="Math.min(100, (crop.quantity / 1000) * 100)"></div>
              </div>
              <span class="progress-label">Market Availability</span>
            </div>
          </div>
          <div class="card-footer">
            <span class="crop-id-tag">REF: #{{ crop.id }}</span>
          </div>
        </div>

        <div *ngIf="filteredCrops.length === 0 && !isLoading" class="empty-marketplace">
          <div class="empty-visual">🌾</div>
          <h3>No Crops Found</h3>
          <p>{{ searchTerm ? 'Try adjusting your search filters' : 'The marketplace is currently resting. Check back soon!' }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 8px 0; }
    .list-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; flex-wrap: wrap; gap: 20px; }
    .page-title { font-size: 2.2rem; color: #1b5e20; margin-bottom: 4px; font-weight: 800; letter-spacing: -0.5px; }
    .page-subtitle { color: #64748b; font-size: 1rem; margin: 0; font-weight: 500; }

    .header-controls { display: flex; gap: 16px; align-items: center; }
    .search-bar { position: relative; background: #fff; border: 2px solid #e2e8f0; border-radius: 12px; padding: 0 16px; display: flex; align-items: center; width: 300px; transition: all 0.2s; }
    .search-bar:focus-within { border-color: #10b981; box-shadow: 0 0 0 4px rgba(16,185,129,0.1); }
    .search-icon { color: #94a3b8; margin-right: 12px; }
    .search-bar input { border: none; padding: 12px 0; width: 100%; outline: none; font-size: 0.95rem; font-weight: 600; color: #1e293b; }

    .btn-load {
      background: #10b981; color: #fff;
      padding: 14px 28px; border: none; border-radius: 12px;
      font-weight: 800; cursor: pointer; transition: all 0.2s; white-space: nowrap;
      box-shadow: 0 4px 12px rgba(16,185,129,0.2);
    }
    .btn-load:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(16,185,129,0.3); background: #059669; }
    .btn-load:disabled { opacity: 0.5; cursor: not-allowed; }

    .alert { padding: 16px; border-radius: 12px; margin-bottom: 24px; font-weight: 700; text-align: center; }
    .alert-info { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }

    .marketplace-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }

    .crop-card-premium {
      background: #fff; border-radius: 24px; border: 1px solid #f1f5f9;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); overflow: hidden;
      display: flex; flex-direction: column;
    }
    .crop-card-premium:hover { transform: translateY(-8px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); border-color: #10b981; }

    .card-header { padding: 20px 24px 0; display: flex; justify-content: space-between; align-items: center; }
    .crop-tag { background: #f1f5f9; color: #475569; font-size: 0.7rem; font-weight: 800; padding: 4px 10px; border-radius: 8px; letter-spacing: 0.05em; }
    .crop-emoji { font-size: 1.5rem; }

    .card-content { padding: 20px 24px; flex-grow: 1; }
    .crop-name { font-size: 1.4rem; font-weight: 800; color: #1e293b; margin: 0 0 12px 0; }
    .price-row { display: flex; align-items: baseline; gap: 4px; margin-bottom: 20px; }
    .price-val { font-size: 1.8rem; font-weight: 800; color: #10b981; }
    .price-unit { color: #64748b; font-weight: 600; font-size: 0.9rem; }

    .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
    .meta-item { display: flex; flex-direction: column; gap: 4px; }
    .meta-label { font-size: 0.75rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.025em; }
    .meta-value { font-weight: 700; color: #1e293b; font-size: 1rem; }
    .meta-value.highlight { color: #059669; }

    .stock-progress { margin-top: auto; }
    .progress-bar { height: 8px; background: #f1f5f9; border-radius: 4px; overflow: hidden; margin-bottom: 8px; }
    .progress-fill { height: 100%; background: linear-gradient(90deg, #10b981, #34d399); border-radius: 4px; transition: width 1s ease-out; }
    .progress-label { font-size: 0.75rem; font-weight: 600; color: #64748b; }

    .card-footer { padding: 16px 24px; background: #f8fafc; border-top: 1px solid #f1f5f9; }
    .crop-id-tag { font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: #94a3b8; font-weight: 600; }

    .empty-marketplace { grid-column: 1 / -1; text-align: center; padding: 80px 24px; background: #fff; border-radius: 32px; border: 2px dashed #e2e8f0; }
    .empty-visual { font-size: 4rem; margin-bottom: 20px; }
    .empty-marketplace h3 { font-size: 1.5rem; font-weight: 800; color: #1e293b; margin-bottom: 8px; }
    .empty-marketplace p { color: #64748b; font-weight: 500; }

    .loading-dots span { animation: blink 1.2s infinite; animation-fill-mode: both; }
    .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
    .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes blink { 0%, 80%, 100% { opacity: 0; } 40% { opacity: 1; } }
  `]
})
export class BrowseCropsComponent implements OnInit, OnDestroy {
  private cropService = inject(CropService);
  private sub = new Subscription();
  protected Math = Math;
  
  crops: Crop[] = [];
  filteredCrops: Crop[] = [];
  searchTerm: string = '';
  
  message = '';
  isLoading = false;

  ngOnInit() {
    this.sub.add(
      this.cropService.crops$.subscribe(data => {
        if (data) {
          this.crops = data;
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
    this.isLoading = true;
    this.message = '';

    this.cropService.getAllCrops().subscribe({
      next: (data) => {
        this.isLoading = false;
        if (!data || data.length === 0) this.message = 'No crops available';
      },
      error: (err) => {
        this.isLoading = false;
        if (this.crops.length === 0) {
          this.message = err.status === 0 ? 'Backend not running' : 'Failed to load crops';
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

  trackByCropId(index: number, crop: Crop) {
    return crop.id;
  }
}


