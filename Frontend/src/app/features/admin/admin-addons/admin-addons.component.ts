import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddonService } from '../../../core/services/addon.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-addons',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1 class="page-title">🧩 Manage Addons</h1>
          <p class="page-subtitle">Create and manage platform addon services</p>
        </div>
        <button (click)="loadAddons()" [disabled]="isLoading" class="btn-refresh">
          <span *ngIf="!isLoading">🔄 Refresh</span>
          <span *ngIf="isLoading" class="loading-dots">Loading<span>.</span><span>.</span><span>.</span></span>
        </button>
      </div>

      <!-- Add Addon Form -->
      <div class="form-card">
        <div class="card-title">➕ Add New Addon</div>
        <div *ngIf="formMsg" class="alert" [class.alert-success]="!formErr" [class.alert-error]="formErr">
          {{ formMsg }}
        </div>
        <form [formGroup]="addonForm" (ngSubmit)="addAddon()" class="form-grid">
          <div class="form-group">
            <label class="form-label">Name</label>
            <input type="text" formControlName="name" class="form-control" placeholder="e.g. Premium Insurance">
          </div>
          <div class="form-group">
            <label class="form-label">Price (₹)</label>
            <input type="number" formControlName="price" class="form-control" placeholder="999">
          </div>
          <div class="form-group span-2">
            <label class="form-label">Description</label>
            <input type="text" formControlName="description" class="form-control" placeholder="Short description of the addon">
          </div>
          <div class="form-group span-2">
            <button type="submit" class="btn-submit" [disabled]="addonForm.invalid || isSaving">
              {{ isSaving ? 'Adding...' : '✅ Add Addon' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Addon Table -->
      <div *ngIf="listMsg" class="alert alert-info">{{ listMsg }}</div>

      <div class="table-card">
        <div class="table-meta" *ngIf="addons.length > 0">{{ addons.length }} addon{{ addons.length === 1 ? '' : 's' }}</div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let a of addons">
                <td><span class="id-badge">#{{ a.id }}</span></td>
                <td class="name-cell">{{ a.name }}</td>
                <td class="muted">{{ a.description }}</td>
                <td class="price-cell">₹{{ a.price }}</td>
                <td><span class="chip chip-green">{{ a.status || 'ACTIVE' }}</span></td>
                <td>
                  <button class="btn-danger-sm" (click)="deleteAddon(a.id)">🗑️ Delete</button>
                </td>
              </tr>
              <tr *ngIf="addons.length === 0">
                <td colspan="6" class="empty-row">No addons found. Add the first one above.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 8px 0; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; flex-wrap: wrap; gap: 16px; }
    .page-title { font-size: 1.8rem; color: #1b5e20; margin-bottom: 4px; margin-top: 0; }
    .page-subtitle { color: #6c757d; font-size: 0.95rem; margin: 0; }

    .btn-refresh {
      background: #f5f5f5; color: #555; padding: 10px 20px; border: 1px solid #ddd;
      border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s;
    }
    .btn-refresh:hover:not(:disabled) { background: #e0e0e0; }
    .btn-refresh:disabled { opacity: 0.55; cursor: not-allowed; }

    .form-card { background: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e8f5e9; margin-bottom: 24px; }
    .card-title { font-size: 1.05rem; font-weight: 700; color: #1b5e20; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid #e8f5e9; }

    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    @media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } }
    .form-group { }
    .span-2 { grid-column: span 2; }
    @media (max-width: 600px) { .span-2 { grid-column: span 1; } }
    .form-label { display: block; font-weight: 600; font-size: 0.88rem; color: #444; margin-bottom: 6px; }
    .form-control { width: 100%; padding: 11px 14px; border: 1px solid #d0e8d0; border-radius: 8px; font-size: 0.95rem; box-sizing: border-box; outline: none; transition: border-color 0.2s; }
    .form-control:focus { border-color: #2e7d32; box-shadow: 0 0 0 3px rgba(46,125,50,0.12); }

    .btn-submit { padding: 12px 28px; background: linear-gradient(135deg, #2e7d32, #388e3c); color: #fff; border: none; border-radius: 8px; font-weight: 700; font-size: 0.95rem; cursor: pointer; transition: all 0.2s; }
    .btn-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(46,125,50,0.3); }
    .btn-submit:disabled { opacity: 0.55; cursor: not-allowed; }

    .alert { padding: 12px 16px; border-radius: 8px; margin-bottom: 16px; font-weight: 500; font-size: 0.9rem; }
    .alert-success { background: #e8f5e9; color: #2e7d32; border: 1px solid #a5d6a7; }
    .alert-error { background: #ffebee; color: #c62828; border: 1px solid #ef9a9a; }
    .alert-info { background: #fff8e1; color: #e65100; border: 1px solid #ffe082; }

    .table-card { background: #fff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e8f5e9; overflow: hidden; }
    .table-meta { padding: 14px 20px; font-size: 0.85rem; color: #6c757d; border-bottom: 1px solid #f0f0f0; background: #fafafa; }
    .table-responsive { overflow-x: auto; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th { padding: 12px 16px; text-align: left; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; color: #888; background: #fafafa; border-bottom: 1px solid #eee; }
    .data-table td { padding: 13px 16px; border-bottom: 1px solid #f5f5f5; font-size: 0.95rem; }
    .data-table tbody tr:hover { background: #f1f8e9; }
    .data-table tbody tr:last-child td { border-bottom: none; }

    .id-badge { background: #e8f5e9; color: #2e7d32; padding: 3px 10px; border-radius: 20px; font-weight: 700; font-size: 0.82rem; }
    .name-cell { font-weight: 600; color: #333; }
    .price-cell { color: #2e7d32; font-weight: 700; }
    .muted { color: #888; font-size: 0.9rem; }
    .empty-row { text-align: center; color: #aaa; padding: 40px; }
    .chip { padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 700; }
    .chip-green { background: #e8f5e9; color: #2e7d32; }
    .btn-danger-sm { padding: 6px 14px; background: #ffebee; color: #c62828; border: 1px solid #ef9a9a; border-radius: 6px; font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: all 0.15s; }
    .btn-danger-sm:hover { background: #c62828; color: #fff; }

    .loading-dots span { animation: blink 1.2s infinite; animation-fill-mode: both; }
    .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
    .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes blink { 0%, 80%, 100% { opacity: 0; } 40% { opacity: 1; } }
  `]
})
export class AdminAddonsComponent {
  private addonService = inject(AddonService);
  private fb = inject(FormBuilder);

  addons: any[] = [];
  isLoading = false;
  isSaving = false;
  formMsg = '';
  formErr = false;
  listMsg = '';

  addonForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(1)]]
  });

  ngOnInit() {
    this.loadAddons();
  }

  loadAddons() {
    this.isLoading = true;
    this.listMsg = '';
    this.addonService.getAddons().subscribe({
      next: (data: any[]) => { this.isLoading = false; this.addons = data || []; },
      error: (err: any) => { this.isLoading = false; this.listMsg = err.status === 0 ? 'Backend not running' : 'Failed to load addons'; }
    });
  }

  addAddon() {
    if (this.addonForm.invalid) return;
    this.isSaving = true;
    this.formMsg = '';
    this.addonService.addAddon(this.addonForm.value as any).subscribe({
      next: () => {
        this.isSaving = false;
        this.formErr = false;
        this.formMsg = 'Addon added successfully!';
        this.addonForm.reset();
        this.loadAddons();
      },
      error: (err: any) => {
        this.isSaving = false;
        this.formErr = true;
        this.formMsg = err.status === 0 ? 'Backend not running' : 'Failed to add addon';
      }
    });
  }

  deleteAddon(id: string) {
    if (!confirm('Delete this addon?')) return;
    this.addonService.deleteAddon(id).subscribe({
      next: () => this.loadAddons(),
      error: (err: any) => alert(err.status === 0 ? 'Backend not running' : 'Delete failed')
    });
  }
}
