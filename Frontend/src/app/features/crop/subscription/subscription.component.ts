import { Component, inject, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CropService } from '../../../core/services/crop.service';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">

      <div class="page-header">
        <h1 class="page-title">🔔 Subscribe to Crop</h1>
        <p class="page-subtitle">Get notified when your preferred crop becomes available</p>
      </div>

      <div class="content-grid">

        <!-- ── Subscription Form ── -->
        <div class="form-card">
          <div class="card-label">New Subscription</div>

          <!-- Status banner -->
          <div *ngIf="status" class="banner"
               [class.banner-success]="status === 'success'"
               [class.banner-error]="status === 'error'">
            <span class="banner-icon">{{ status === 'success' ? '✔' : '✖' }}</span>
            <span class="banner-text">{{ statusMsg }}</span>
            <button class="banner-close" (click)="status = ''">×</button>
          </div>

          <form (ngSubmit)="subscribe()" #subForm="ngForm">

            <div class="form-group">
              <label class="form-label" for="dealerId">Dealer ID</label>
              <input id="dealerId" type="number" name="dealerId"
                     [(ngModel)]="form.dealerId" required min="1"
                     class="form-control" placeholder="e.g. 5">
            </div>

            <div class="form-group">
              <label class="form-label" for="cropType">Crop Type</label>
              <input id="cropType" type="text" name="cropType"
                     [(ngModel)]="form.cropType" required
                     class="form-control" placeholder="e.g. Maize, Wheat, Rice">
            </div>

            <button type="submit" id="subscribeBtn"
                    class="btn btn-primary submit-btn"
                    [disabled]="isLoading || subForm.invalid">
              <span *ngIf="!isLoading">🔔 Subscribe</span>
              <span *ngIf="isLoading" class="loading-dots">Subscribing<span>.</span><span>.</span><span>.</span></span>
            </button>
          </form>
        </div>

        <!-- ── Info Panel ── -->
        <div class="info-card">
          <div class="info-icon">💡</div>
          <h3 class="info-title">How it works</h3>
          <ul class="info-list">
            <li>Enter your <strong>Dealer ID</strong> and the <strong>Crop Type</strong> you are interested in.</li>
            <li>When a farmer lists that crop, you will be <strong>notified automatically</strong>.</li>
            <li>You can subscribe to <strong>multiple crop types</strong> at any time.</li>
          </ul>
          <div class="info-divider"></div>
          <div class="info-note">
            🌾 Subscriptions are <strong>free</strong> and help farmers know market demand.
          </div>
        </div>

      </div>

      <!-- ── Subscription History Placeholder ── -->
      <div *ngIf="subscriptions.length > 0" class="history-card">
        <div class="history-title">📋 Your Subscriptions This Session</div>
        <div class="history-list">
          <div *ngFor="let s of subscriptions" class="history-item">
            <span class="hist-crop">{{ s.cropType }}</span>
            <span class="hist-sep">·</span>
            <span class="hist-dealer">Dealer #{{ s.dealerId }}</span>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .page-container { padding: 8px 0; max-width: 860px; }
    .page-header { margin-bottom: 28px; }
    .page-title  { font-size: 1.8rem; color: #1b5e20; margin-bottom: 4px; }
    .page-subtitle { color: #6c757d; font-size: 0.95rem; }

    /* Two-column grid */
    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 28px;
    }
    @media (max-width: 640px) { .content-grid { grid-template-columns: 1fr; } }

    /* Form card */
    .form-card {
      background: #fff;
      border-radius: 14px;
      padding: 32px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
      border: 1px solid #e8f5e9;
    }
    .card-label {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #81c784;
      margin-bottom: 20px;
    }

    /* Status banner */
    .banner {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 13px 16px;
      border-radius: 10px;
      margin-bottom: 20px;
      font-weight: 600;
      font-size: 0.93rem;
      animation: slideDown 0.3s ease;
    }
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .banner-success { background: #e8f5e9; color: #1b5e20; border: 1.5px solid #81c784; }
    .banner-error   { background: #ffebee; color: #b71c1c; border: 1.5px solid #ef9a9a; }
    .banner-icon  { font-size: 1rem; flex-shrink: 0; }
    .banner-text  { flex: 1; }
    .banner-close {
      background: none; border: none; font-size: 1.1rem;
      cursor: pointer; opacity: 0.55; color: inherit; padding: 0 2px;
    }
    .banner-close:hover { opacity: 1; }

    /* Form fields */
    .form-group { margin-bottom: 20px; }

    .submit-btn {
      width: 100%;
      padding: 14px;
      font-size: 1rem;
      margin-top: 4px;
      border-radius: 10px;
    }

    /* Info card */
    .info-card {
      background: linear-gradient(145deg, #f1f8e9, #e8f5e9);
      border-radius: 14px;
      padding: 32px;
      border: 1px solid #c8e6c9;
    }
    .info-icon  { font-size: 2rem; margin-bottom: 12px; }
    .info-title { font-size: 1.05rem; color: #2e7d32; font-weight: 700; margin: 0 0 16px; }
    .info-list  { padding-left: 18px; color: #4a4a4a; font-size: 0.93rem; line-height: 2; margin: 0 0 16px; }
    .info-divider { height: 1px; background: #c8e6c9; margin: 16px 0; }
    .info-note  { font-size: 0.88rem; color: #558b2f; background: rgba(255,255,255,0.6); padding: 10px 14px; border-radius: 8px; line-height: 1.5; }

    /* History card */
    .history-card {
      background: #fff;
      border-radius: 14px;
      padding: 24px 28px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      border: 1px solid #e8f5e9;
    }
    .history-title { font-size: 0.88rem; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 16px; }
    .history-list  { display: flex; flex-wrap: wrap; gap: 10px; }
    .history-item  {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #f1f8e9;
      border: 1px solid #c8e6c9;
      border-radius: 20px;
      padding: 6px 14px;
      font-size: 0.88rem;
    }
    .hist-crop   { font-weight: 700; color: #2e7d32; }
    .hist-sep    { color: #bbb; }
    .hist-dealer { color: #6c757d; }

    .loading-dots span { animation: blink 1.2s infinite; animation-fill-mode: both; }
    .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
    .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes blink { 0%, 80%, 100% { opacity: 0; } 40% { opacity: 1; } }
  `]
})
export class SubscriptionComponent {
  private cropService = inject(CropService);
  private zone = inject(NgZone);
  private cdr  = inject(ChangeDetectorRef);

  form = { dealerId: 0, cropType: '' };

  isLoading    = false;
  status       = '';       // '' | 'success' | 'error'
  statusMsg    = '';

  /** Tracks subscriptions done this session for the history pill list */
  subscriptions: Array<{ dealerId: number; cropType: string }> = [];

  subscribe() {
    this.isLoading = true;
    this.status    = '';

    this.cropService.subscribe(this.form).subscribe({
      next: (res) => {
        console.log('[Subscribe] ✔ Response:', res);
        this.zone.run(() => {
          this.isLoading   = false;
          this.status      = 'success';
          this.statusMsg   = `✔ Subscribed to "${this.form.cropType}" successfully!`;
          // save to session history list
          this.subscriptions.push({ ...this.form });
          this.form = { dealerId: 0, cropType: '' };
          this.cdr.markForCheck();
          setTimeout(() => this.zone.run(() => { this.status = ''; this.cdr.markForCheck(); }), 5000);
        });
      },
      error: (err) => {
        console.error('[Subscribe] ✖ Error:', err);
        this.zone.run(() => {
          this.isLoading = false;
          this.status    = 'error';
          this.statusMsg = err.status === 0
            ? '✖ Backend not running — check your services.'
            : err.status === 409
            ? '✖ Already subscribed to this crop type.'
            : err.status === 500
            ? '✖ Server error — check backend logs.'
            : `✖ Subscription failed (HTTP ${err.status}).`;
          this.cdr.markForCheck();
        });
      }
    });
  }
}
