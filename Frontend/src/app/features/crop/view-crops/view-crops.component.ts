import { Component, inject, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CropService } from '../../../core/services/crop.service';

@Component({
  selector: 'app-crop-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">

      <!-- Header -->
      <div class="list-header">
        <div>
          <h1 class="page-title">🌾 Crop Marketplace</h1>
          <p class="page-subtitle">All crop listings available for trading</p>
        </div>
        <button class="btn-load" id="loadCropsBtn" (click)="loadCrops()" [disabled]="isLoading">
          <span *ngIf="!isLoading">🔄 Load Crops</span>
          <span *ngIf="isLoading" class="loading-dots">Loading<span>.</span><span>.</span><span>.</span></span>
        </button>
      </div>

      <!-- Error Banner -->
      <div *ngIf="errorMsg" class="banner banner-error">
        <span>⚠️</span>
        <span class="banner-text">{{ errorMsg }}</span>
        <button class="banner-close" (click)="errorMsg = ''">×</button>
      </div>

      <!-- Empty state — before first load -->
      <div *ngIf="!hasLoaded && !isLoading" class="empty-state">
        <div class="empty-icon">🌾</div>
        <p class="empty-text">Click <strong>Load Crops</strong> to view the marketplace</p>
      </div>

      <!-- Empty state — after load with no data -->
      <div *ngIf="hasLoaded && crops.length === 0 && !isLoading" class="empty-state">
        <div class="empty-icon">🪣</div>
        <p class="empty-text">No crops listed yet. Add one to get started!</p>
      </div>

      <!-- Crops Table -->
      <div *ngIf="crops.length > 0" class="table-card">
        <div class="table-meta">
          <span class="count-badge">{{ crops.length }}</span>
          crop{{ crops.length === 1 ? '' : 's' }} listed in the marketplace
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Crop Name</th>
                <th>Price / kg</th>
                <th>Quantity</th>
                <th>Farmer ID</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let crop of crops">
                <td><span class="id-badge">#{{ crop.id }}</span></td>
                <td class="crop-name">{{ crop.name || crop.cropName }}</td>
                <td><span class="price-tag">₹{{ crop.price }}</span></td>
                <td><span class="qty-tag">{{ crop.quantity || crop.qty }} kg</span></td>
                <td><span class="farmer-badge">F-{{ crop.farmerId }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .page-container { padding: 8px 0; }

    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 28px;
      flex-wrap: wrap;
      gap: 16px;
    }
    .page-title { font-size: 1.8rem; color: #1b5e20; margin-bottom: 4px; }
    .page-subtitle { color: #6c757d; font-size: 0.95rem; }

    /* Load button */
    .btn-load {
      background: linear-gradient(135deg, #2e7d32, #43a047);
      color: #fff;
      padding: 12px 26px;
      border: none;
      border-radius: 10px;
      font-weight: 700;
      cursor: pointer;
      font-size: 0.95rem;
      box-shadow: 0 2px 10px rgba(46,125,50,0.25);
      transition: transform 0.15s, box-shadow 0.15s;
    }
    .btn-load:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(46,125,50,0.35);
    }
    .btn-load:disabled { opacity: 0.6; cursor: not-allowed; }

    /* Error banner */
    .banner {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 18px;
      border-radius: 10px;
      margin-bottom: 20px;
      font-weight: 600;
      font-size: 0.95rem;
      animation: slideDown 0.3s ease;
    }
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .banner-error { background: #ffebee; color: #b71c1c; border: 1.5px solid #ef9a9a; }
    .banner-text  { flex: 1; }
    .banner-close {
      background: none; border: none; font-size: 1.1rem;
      cursor: pointer; opacity: 0.6; color: inherit; padding: 0 2px;
    }
    .banner-close:hover { opacity: 1; }

    /* Table card */
    .table-card {
      background: #fff;
      border-radius: 14px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
      border: 1px solid #e8f5e9;
      overflow: hidden;
    }
    .table-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 14px 20px;
      font-size: 0.88rem;
      color: #6c757d;
      border-bottom: 1px solid #f0f0f0;
      background: #fafdf9;
    }
    .count-badge {
      background: #e8f5e9;
      color: #2e7d32;
      font-weight: 700;
      padding: 2px 10px;
      border-radius: 20px;
      font-size: 0.85rem;
    }
    .table-responsive { overflow-x: auto; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th {
      padding: 12px 18px;
      text-align: left;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.7px;
      color: #999;
      background: #fafafa;
      border-bottom: 1px solid #eee;
    }
    .data-table td {
      padding: 14px 18px;
      border-bottom: 1px solid #f5f5f5;
      font-size: 0.94rem;
      color: #333;
    }
    .data-table tbody tr { transition: background 0.15s; }
    .data-table tbody tr:hover { background: #f1f8e9; }
    .data-table tbody tr:last-child td { border-bottom: none; }

    .id-badge     { background: #f3e5f5; color: #6a1b9a; padding: 3px 10px; border-radius: 20px; font-weight: 700; font-size: 0.82rem; }
    .crop-name    { font-weight: 600; color: #1b5e20; }
    .price-tag    { background: #e8f5e9; color: #2e7d32; padding: 4px 12px; border-radius: 20px; font-weight: 700; font-size: 0.9rem; }
    .qty-tag      { background: #fff8e1; color: #e65100; padding: 3px 10px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; }
    .farmer-badge { background: #e3f2fd; color: #1565c0; padding: 3px 10px; border-radius: 20px; font-size: 0.82rem; font-weight: 600; }

    /* Empty state */
    .empty-state {
      text-align: center;
      padding: 64px 24px;
      background: #fff;
      border-radius: 14px;
      box-shadow: 0 2px 16px rgba(0,0,0,0.05);
      border: 1.5px dashed #c8e6c9;
    }
    .empty-icon { font-size: 3.2rem; margin-bottom: 14px; }
    .empty-text { color: #888; font-size: 1rem; line-height: 1.6; }

    .loading-dots span { animation: blink 1.2s infinite; animation-fill-mode: both; }
    .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
    .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes blink { 0%, 80%, 100% { opacity: 0; } 40% { opacity: 1; } }
  `]
})
export class CropViewComponent {
  private cropService = inject(CropService);
  private zone = inject(NgZone);
  private cdr  = inject(ChangeDetectorRef);

  crops: any[] = [];
  isLoading = false;
  hasLoaded = false;
  errorMsg  = '';

  loadCrops() {
    this.isLoading = true;
    this.errorMsg  = '';
    this.crops     = [];

    this.cropService.getAllCrops().subscribe({
      next: (res) => {
        console.log('[ViewCrops] ✔ Response:', res);
        this.zone.run(() => {
          this.isLoading = false;
          this.hasLoaded = true;
          this.crops = Array.isArray(res) ? res : [];
          this.cdr.markForCheck();
        });
      },
      error: (err) => {
        console.error('[ViewCrops] ✖ Error:', err);
        this.zone.run(() => {
          this.isLoading = false;
          this.hasLoaded = true;
          this.errorMsg  = err.status === 0
            ? 'Backend not running — check your services.'
            : `Failed to load crops (HTTP ${err.status}).`;
          this.cdr.markForCheck();
        });
      }
    });
  }
}
