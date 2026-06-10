import { Component, inject, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CropService } from '../../../core/services/crop.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-crop-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">🌾 Add New Crop</h1>
        <p class="page-subtitle">Register a new crop listing to the marketplace</p>
      </div>

      <!-- ── Add Crop Form ── -->
      <div class="form-card">

        <!-- SUCCESS / ERROR BANNER — always inside the visible card -->
        <div *ngIf="addStatus" class="banner" [class.banner-success]="addStatus === 'success'" [class.banner-error]="addStatus === 'error'">
          <span class="banner-icon">{{ addStatus === 'success' ? '✔' : '✖' }}</span>
          <span class="banner-text">{{ addMessage }}</span>
          <button class="banner-close" (click)="addStatus = ''">×</button>
        </div>

        <form (ngSubmit)="addCrop()" #cropForm="ngForm">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="cropName">Crop Name</label>
              <input id="cropName" type="text" name="name" [(ngModel)]="crop.name" required
                     class="form-control" placeholder="e.g. Maize, Wheat, Rice">
            </div>
            <div class="form-group">
              <label class="form-label" for="price">Price per kg (₹)</label>
              <input id="price" type="number" name="price" [(ngModel)]="crop.price" required min="1"
                     class="form-control" placeholder="1800">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="farmerId">Farmer ID</label>
              <input id="farmerId" type="number" name="farmerId" [(ngModel)]="crop.farmerId" required min="1"
                     class="form-control" placeholder="1">
            </div>
            <div class="form-group">
              <label class="form-label" for="quantity">Quantity (kg)</label>
              <input id="quantity" type="number" name="quantity" [(ngModel)]="crop.quantity" required min="1"
                     class="form-control" placeholder="250">
            </div>
          </div>

          <button type="submit" id="addCropBtn" class="btn btn-primary submit-btn"
                  [disabled]="isSubmitting || cropForm.invalid">
            <span *ngIf="!isSubmitting">🌾 Add Crop</span>
            <span *ngIf="isSubmitting" class="loading-dots">Submitting<span>.</span><span>.</span><span>.</span></span>
          </button>
        </form>
      </div>

      <!-- ── Divider ── -->
      <div class="section-divider">
        <span class="divider-label">or</span>
      </div>

      <!-- ── Delete Crop Section ── -->
      <div class="form-card delete-card">
        <div class="delete-header">
          <span class="delete-icon">🗑️</span>
          <div>
            <h2 class="delete-title">Delete Crop</h2>
            <p class="delete-subtitle">Permanently remove a crop listing by its ID</p>
          </div>
        </div>

        <!-- DELETE BANNER -->
        <div *ngIf="deleteStatus" class="banner" [class.banner-success]="deleteStatus === 'success'" [class.banner-error]="deleteStatus === 'error'">
          <span class="banner-icon">{{ deleteStatus === 'success' ? '✔' : '✖' }}</span>
          <span class="banner-text">{{ deleteMessage }}</span>
          <button class="banner-close" (click)="deleteStatus = ''">×</button>
        </div>

        <form (ngSubmit)="deleteCrop()" #deleteForm="ngForm" class="delete-form">
          <div class="form-group delete-input-group">
            <label class="form-label" for="deleteCropId">Crop ID</label>
            <input id="deleteCropId" type="text" name="deleteCropId"
                   [(ngModel)]="deleteCropId" required
                   class="form-control" placeholder="Enter crop ID to delete">
          </div>
          <button type="submit" id="deleteCropBtn" class="btn btn-danger delete-btn"
                  [disabled]="deleteIsLoading || deleteForm.invalid">
            <span *ngIf="!deleteIsLoading">🗑️ Delete Crop</span>
            <span *ngIf="deleteIsLoading" class="loading-dots">Deleting<span>.</span><span>.</span><span>.</span></span>
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .page-container { max-width: 680px; margin: 0 auto; padding: 8px 0; }
    .page-header { margin-bottom: 28px; }
    .page-title { font-size: 1.8rem; color: #1b5e20; margin-bottom: 4px; }
    .page-subtitle { color: #6c757d; font-size: 0.95rem; }

    .form-card {
      background: #fff;
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      border: 1px solid #e8f5e9;
    }
    .delete-card {
      border-color: #fce4e4;
      box-shadow: 0 4px 20px rgba(198,40,40,0.06);
    }

    /* ── Status Banner ── */
    .banner {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 16px;
      border-radius: 10px;
      margin-bottom: 22px;
      font-size: 0.95rem;
      font-weight: 600;
      animation: slideDown 0.3s ease;
    }
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .banner-success {
      background: #e8f5e9;
      color: #1b5e20;
      border: 1.5px solid #81c784;
    }
    .banner-error {
      background: #ffebee;
      color: #b71c1c;
      border: 1.5px solid #ef9a9a;
    }
    .banner-icon { font-size: 1.1rem; flex-shrink: 0; }
    .banner-text { flex: 1; }
    .banner-close {
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      opacity: 0.6;
      line-height: 1;
      padding: 0 2px;
      color: inherit;
    }
    .banner-close:hover { opacity: 1; }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    @media (max-width: 520px) { .form-row { grid-template-columns: 1fr; } }

    .form-group { margin-bottom: 20px; }

    .submit-btn {
      width: 100%;
      padding: 14px;
      font-size: 1.05rem;
      margin-top: 8px;
      border-radius: 8px;
    }

    /* ── Divider ── */
    .section-divider {
      display: flex;
      align-items: center;
      margin: 28px 0;
      gap: 14px;
    }
    .section-divider::before,
    .section-divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: #e0e0e0;
    }
    .divider-label {
      color: #9e9e9e;
      font-size: 0.82rem;
      font-weight: 600;
      letter-spacing: 0.6px;
      text-transform: uppercase;
    }

    /* ── Delete card ── */
    .delete-header {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      margin-bottom: 22px;
    }
    .delete-icon { font-size: 2rem; line-height: 1.1; }
    .delete-title { font-size: 1.2rem; color: #b71c1c; margin: 0 0 4px; font-weight: 700; }
    .delete-subtitle { color: #6c757d; font-size: 0.88rem; margin: 0; }

    .delete-form {
      display: flex;
      gap: 14px;
      align-items: flex-end;
    }
    .delete-input-group { flex: 1; margin-bottom: 0; }

    .btn-danger {
      background: linear-gradient(135deg, #e53935, #b71c1c);
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 12px 22px;
      font-size: 0.98rem;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
      box-shadow: 0 2px 8px rgba(183,28,28,0.25);
    }
    .btn-danger:hover:not(:disabled) {
      opacity: 0.92;
      transform: translateY(-1px);
      box-shadow: 0 4px 14px rgba(183,28,28,0.35);
    }
    .btn-danger:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }

    @media (max-width: 520px) {
      .delete-form { flex-direction: column; }
      .delete-btn { width: 100%; }
    }

    .loading-dots span {
      animation: blink 1.2s infinite;
      animation-fill-mode: both;
    }
    .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
    .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes blink {
      0%, 80%, 100% { opacity: 0; }
      40% { opacity: 1; }
    }
  `]
})
export class CropAddComponent {
  private http   = inject(HttpClient);
  private cs     = inject(CropService);
  private zone   = inject(NgZone);
  private cdr    = inject(ChangeDetectorRef);


  // ── Add Crop ──────────────────────────────────────────────────────────────
  crop         = { name: '', price: 0, farmerId: 0, quantity: 0 };
  isSubmitting = false;
  addStatus    = '';        // '' | 'success' | 'error'
  addMessage   = '';

  // ── Delete Crop ───────────────────────────────────────────────────────────
  deleteCropId    = '';
  deleteIsLoading = false;
  deleteStatus    = '';     // '' | 'success' | 'error'
  deleteMessage   = '';

  // ─────────────────────────────────────────────────────────────────────────

  addCrop() {
    this.isSubmitting = true;
    this.addStatus    = '';

    this.cs.addCrop(this.crop as any).subscribe({
      next: (res) => {
        console.log('[AddCrop] ✔ Response:', res);
        this.zone.run(() => {
          this.isSubmitting = false;
          this.addStatus    = 'success';
          this.addMessage   = `✔ Crop "${this.crop.name}" listed successfully!`;
          this.crop         = { name: '', price: 0, farmerId: 0, quantity: 0 };
          this.cdr.markForCheck();
          // Auto-dismiss after 5 s
          setTimeout(() => this.zone.run(() => { this.addStatus = ''; this.cdr.markForCheck(); }), 5000);
        });
      },
      error: (err) => {
        console.error('[AddCrop] ✖ Error:', err);
        this.zone.run(() => {
          this.isSubmitting = false;
          this.addStatus    = 'error';
          this.addMessage   = err.status === 0
            ? '✖ Backend not running — check your services.'
            : err.status === 404
            ? '✖ Crop endpoint not found. Check API Gateway routing.'
            : err.status === 500
            ? '✖ Server error — check backend logs.'
            : `✖ Submission failed (HTTP ${err.status}).`;
          this.cdr.markForCheck();
        });
      }
    });
  }

  deleteCrop() {
    if (!this.deleteCropId) return;
    this.deleteIsLoading = true;
    this.deleteStatus    = '';

    this.cs.deleteCrop(this.deleteCropId).subscribe({
      next: (res) => {
        console.log('[DeleteCrop] ✔ Response:', res);
        this.zone.run(() => {
          this.deleteIsLoading = false;
          this.deleteStatus    = 'success';
          this.deleteMessage   = `✔ Crop #${this.deleteCropId} deleted successfully.`;
          this.deleteCropId    = '';
          this.cdr.markForCheck();
        });
      },
      error: (err) => {
        console.error('[DeleteCrop] ✖ Error:', err);
        this.zone.run(() => {
          this.deleteIsLoading = false;
          this.deleteStatus    = 'error';
          this.deleteMessage   = `✖ Failed to delete crop. (Check console)`;
          this.cdr.markForCheck();
        });
      }
    });
  }
}
