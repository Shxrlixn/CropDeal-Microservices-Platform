import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DealerService } from '../../../core/services/dealer.service';
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dealers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="admin-container">
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">🤝 Dealer Management</h1>
          <p class="page-subtitle">Configure dealer accounts and manage business credentials with ease.</p>
        </div>
      </div>

      <!-- Status Banner -->
      <div *ngIf="statusMessage" class="status-banner" [class.success]="statusType === 'success'" [class.error]="statusType === 'error'">
        <span class="banner-icon">{{ statusType === 'success' ? '✅' : '❌' }}</span>
        <span class="banner-text">{{ statusMessage }}</span>
        <button (click)="statusMessage = ''" class="banner-close">×</button>
      </div>

      <div class="admin-layout">
        <!-- Dealer Form Card -->
        <div class="card form-card" id="dealerFormCard">
          <div class="card-header" [class.editing-mode]="isEditing">
            <h3>{{ isEditing ? '📝 Update Dealer Profile' : '➕ Register New Dealer' }}</h3>
            <button *ngIf="isEditing" (click)="cancelEdit()" class="btn-cancel">Cancel Edit</button>
          </div>
          
          <div class="form-body">
            <form [formGroup]="dealerForm" (ngSubmit)="saveDealer()" class="dealer-form">
              <!-- Personal Info Section -->
              <div class="form-section">
                <div class="section-header">
                  <span class="section-icon">👤</span>
                  <h4>Personal Details</h4>
                </div>
                <div class="form-grid-2">
                  <div class="form-group">
                    <label>First Name</label>
                    <input type="text" formControlName="firstName" class="form-control" placeholder="John">
                  </div>
                  <div class="form-group">
                    <label>Last Name</label>
                    <input type="text" formControlName="lastName" class="form-control" placeholder="Doe">
                  </div>
                </div>
                <div class="form-grid-2">
                  <div class="form-group">
                    <label>Email Address</label>
                    <input type="email" formControlName="email" class="form-control" placeholder="john@example.com">
                  </div>
                  <div class="form-group">
                    <label>Phone Number</label>
                    <input type="text" formControlName="phone" class="form-control" placeholder="9876543210">
                  </div>
                </div>
              </div>

              <!-- Address Section -->
              <div class="form-section">
                <div class="section-header">
                  <span class="section-icon">📍</span>
                  <h4>Location Details</h4>
                </div>
                <div class="form-group">
                  <label>Full Address</label>
                  <input type="text" formControlName="address" class="form-control" placeholder="123 Green Valley Road">
                </div>
                <div class="form-grid-2">
                  <div class="form-group">
                    <label>State</label>
                    <input type="text" formControlName="state" class="form-control" placeholder="Maharashtra">
                  </div>
                  <div class="form-group">
                    <label>District</label>
                    <input type="text" formControlName="district" class="form-control" placeholder="Mumbai">
                  </div>
                </div>
              </div>

              <!-- Business Section -->
              <div class="form-section">
                <div class="section-header">
                  <span class="section-icon">🏢</span>
                  <h4>Business Info</h4>
                </div>
                <div class="form-group">
                  <label>Business Name</label>
                  <input type="text" formControlName="businessName" class="form-control" placeholder="Crop Solutions Pvt Ltd">
                </div>
                <div class="form-group">
                  <label>GST Number</label>
                  <input type="text" formControlName="gstNumber" class="form-control" placeholder="27AAAAA0000A1Z5">
                </div>
              </div>

              <!-- Bank Section -->
              <div class="form-section">
                <div class="section-header">
                  <span class="section-icon">🏦</span>
                  <h4>Bank Details</h4>
                </div>
                <div class="form-group">
                  <label>Bank Name</label>
                  <input type="text" formControlName="bankName" class="form-control" placeholder="HDFC Bank">
                </div>
                <div class="form-grid-2">
                  <div class="form-group">
                    <label>Account Number</label>
                    <input type="text" formControlName="bankAccountNumber" class="form-control" placeholder="501000...">
                  </div>
                  <div class="form-group">
                    <label>IFSC Code</label>
                    <input type="text" formControlName="ifscCode" class="form-control" placeholder="HDFC0001234">
                  </div>
                </div>
              </div>

              <div class="form-footer">
                <button type="submit" class="btn btn-submit" [disabled]="isLoading" [class.btn-update]="isEditing">
                  <span *ngIf="!isLoading">{{ isEditing ? 'Update Dealer' : 'Register Dealer' }}</span>
                  <span *ngIf="isLoading" class="spinner"></span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Dealers Table Card -->
        <div class="card table-card">
          <div class="card-header table-header">
            <div class="header-main">
              <h3>Active Dealer Registry</h3>
              <span class="badge">{{ dealers.length }} Records</span>
            </div>
            <div class="header-actions">
              <button (click)="loadDealers()" class="btn-refresh" [disabled]="isLoading">
                {{ isLoading ? 'Refetching...' : '🔄 Refresh' }}
              </button>
            </div>
          </div>
          
          <div class="table-container">
            <table class="premium-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Dealer Details</th>
                  <th>Contact</th>
                  <th>Business</th>
                  <th>State</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let d of dealers; trackBy: trackById" class="table-row" [class.active-edit]="editingId === d.id">
                  <td class="col-id">#{{ d.id }}</td>
                  <td>
                    <div class="dealer-cell">
                      <div class="avatar">{{ d.firstName?.[0] }}{{ d.lastName?.[0] }}</div>
                      <div class="name-box">
                        <span class="name">{{ d.firstName }} {{ d.lastName }}</span>
                        <span class="sub-id">Dealer ID: {{ d.id }}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="contact-cell">
                      <span class="email">📧 {{ d.email }}</span>
                      <span class="phone">📞 {{ d.phone }}</span>
                    </div>
                  </td>
                  <td class="col-business">{{ d.businessName }}</td>
                  <td><span class="tag-state">{{ d.state }}</span></td>
                  <td>
                    <button (click)="editDealer(d)" class="btn-edit-action" title="Edit Profile">
                      <span class="btn-icon">✏️</span>
                      <span class="btn-text">Edit</span>
                    </button>
                  </td>
                </tr>
                <tr *ngIf="dealers.length === 0 && !isLoading">
                  <td colspan="6" class="state-cell">
                    <div class="empty-state">
                      <div class="state-icon">🤝</div>
                      <p>Registry is currently empty.</p>
                    </div>
                  </td>
                </tr>
                <tr *ngIf="isLoading && dealers.length === 0">
                  <td colspan="6" class="state-cell">
                    <div class="loading-state">
                      <span class="spinner-large"></span>
                      <p>Fetching dealer data...</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-container { padding: 24px; max-width: 1600px; margin: 0 auto; background: #fdfdfd; min-height: 100vh; }
    
    .page-header { margin-bottom: 32px; border-bottom: 2px solid #e8f5e9; padding-bottom: 20px; }
    .page-title { font-size: 2.4rem; color: #1b5e20; margin: 0; font-weight: 900; letter-spacing: -1px; }
    .page-subtitle { color: #555; margin: 8px 0 0; font-size: 1.1rem; }

    .status-banner {
      display: flex; align-items: center; padding: 16px 24px; border-radius: 12px; margin-bottom: 32px;
      animation: slideDown 0.4s ease; box-shadow: 0 4px 15px rgba(0,0,0,0.08); z-index: 1000;
    }
    @keyframes slideDown { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .status-banner.success { background: #e8f5e9; color: #2e7d32; border-left: 6px solid #2e7d32; }
    .status-banner.error { background: #ffebee; color: #c62828; border-left: 6px solid #c62828; }
    .banner-text { flex: 1; margin-left: 16px; font-weight: 700; }
    .banner-close { background: none; border: none; font-size: 1.6rem; cursor: pointer; color: inherit; }

    .admin-layout { display: grid; grid-template-columns: 550px 1fr; gap: 32px; align-items: start; }
    @media (max-width: 1400px) { .admin-layout { grid-template-columns: 1fr; } }

    .card { background: #fff; border-radius: 28px; box-shadow: 0 20px 40px rgba(0,0,0,0.04); border: 1px solid #f0f0f0; overflow: hidden; }
    
    .card-header { padding: 28px 32px; border-bottom: 1px solid #f5f5f5; display: flex; justify-content: space-between; align-items: center; background: #fafafa; }
    .card-header.editing-mode { background: #fffde7; border-bottom: 2px solid #fbc02d; }
    .card-header h3 { margin: 0; font-size: 1.4rem; color: #1b5e20; font-weight: 800; }

    .form-body { max-height: 75vh; overflow-y: auto; padding: 32px; }
    .form-section { margin-bottom: 32px; }
    .section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; border-bottom: 1px solid #f0f0f0; padding-bottom: 12px; }
    .section-icon { font-size: 1.3rem; }
    .section-header h4 { margin: 0; font-size: 0.95rem; color: #2e7d32; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 800; }

    .form-group { margin-bottom: 24px; }
    .form-group label { display: block; font-size: 0.9rem; font-weight: 800; color: #333; margin-bottom: 10px; }
    .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    
    .form-control {
      width: 100%; padding: 16px 20px; border: 2px solid #eee; border-radius: 16px;
      font-size: 1rem; transition: all 0.3s; background: #fafafa; color: #333; font-weight: 500;
    }
    .form-control:focus { border-color: #2e7d32; outline: none; background: #fff; box-shadow: 0 0 0 5px rgba(46,125,50,0.08); }

    .form-footer { margin-top: 10px; }
    .btn {
      width: 100%; padding: 20px; border-radius: 18px; font-weight: 900; cursor: pointer; border: none;
      transition: all 0.3s; display: flex; justify-content: center; align-items: center; gap: 12px; font-size: 1.15rem;
    }
    .btn-submit { background: linear-gradient(135deg, #2e7d32, #43a047); color: #fff; box-shadow: 0 8px 20px rgba(46,125,50,0.2); }
    .btn-submit:hover:not(:disabled) { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(46,125,50,0.3); }
    .btn-update { background: linear-gradient(135deg, #fbc02d, #f9a825); color: #333; box-shadow: 0 8px 20px rgba(251,192,45,0.2); }
    .btn-update:hover:not(:disabled) { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(251,192,45,0.3); }

    .table-header .header-main { display: flex; align-items: center; gap: 16px; }
    .badge { background: #e8f5e9; color: #2e7d32; padding: 8px 16px; border-radius: 40px; font-weight: 900; font-size: 0.9rem; }
    
    .table-container { padding: 0; overflow-x: auto; position: relative; }
    .premium-table { width: 100%; border-collapse: collapse; min-width: 1000px; }
    .premium-table th { padding: 24px; text-align: left; background: #fafafa; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 2px; color: #777; border-bottom: 2px solid #eee; }
    .premium-table td { padding: 24px; border-bottom: 1px solid #f5f5f5; vertical-align: middle; }
    
    .table-row { transition: all 0.3s ease; }
    .table-row:hover { background: #fcfdfc; }
    .active-edit { background: #fffde7 !important; border-left: 6px solid #fbc02d; }

    .col-id { font-family: 'JetBrains Mono', monospace; color: #aaa; font-weight: 700; font-size: 0.9rem; }
    .dealer-cell { display: flex; align-items: center; gap: 16px; }
    .avatar { width: 48px; height: 48px; background: #2e7d32; color: #fff; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1.1rem; }
    .name-box { display: flex; flex-direction: column; }
    .name { font-weight: 800; color: #1b5e20; font-size: 1.05rem; margin-bottom: 2px; }
    .sub-id { font-size: 0.75rem; color: #999; font-weight: 600; }
    
    .contact-cell { display: flex; flex-direction: column; gap: 4px; }
    .email { color: #2e7d32; font-weight: 700; font-size: 0.95rem; }
    .phone { color: #666; font-size: 0.9rem; font-weight: 600; }

    .col-business { font-weight: 800; color: #444; font-size: 1rem; }
    .tag-state { background: #f0f0f0; padding: 6px 14px; border-radius: 12px; font-size: 0.85rem; color: #555; font-weight: 800; }

    .btn-edit-action {
      background: #e8f5e9; color: #2e7d32; border: none;
      padding: 10px 18px; border-radius: 14px; cursor: pointer; display: flex; align-items: center; gap: 8px;
      transition: all 0.2s; font-weight: 800;
    }
    .btn-edit-action:hover { background: #2e7d32; color: #fff; transform: translateY(-2px); box-shadow: 0 4px 10px rgba(46,125,50,0.2); }

    .btn-cancel { background: #fff; color: #c62828; border: 2px solid #ffcdd2; padding: 8px 16px; border-radius: 10px; font-weight: 800; cursor: pointer; transition: all 0.2s; }
    .btn-cancel:hover { background: #ffebee; }

    .btn-refresh { background: #fff; border: 2px solid #e8f5e9; color: #2e7d32; font-weight: 800; cursor: pointer; padding: 8px 16px; border-radius: 12px; transition: all 0.2s; }
    .btn-refresh:hover { background: #e8f5e9; transform: rotate(15deg); }

    .spinner { width: 26px; height: 26px; border: 4px solid rgba(255,255,255,0.3); border-radius: 50%; border-top-color: #fff; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class AdminDealersComponent implements OnInit {
  private dealerService = inject(DealerService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  
  dealers: any[] = [];
  isLoading = false;
  isEditing = false;
  editingId: string | number | null = null;

  statusMessage = '';
  statusType: 'success' | 'error' = 'success';

  dealerForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    address: ['', Validators.required],
    state: ['', Validators.required],
    district: ['', Validators.required],
    businessName: ['', Validators.required],
    gstNumber: ['', Validators.required],
    bankAccountNumber: ['', Validators.required],
    bankName: ['', Validators.required],
    ifscCode: ['', Validators.required]
  });

  ngOnInit() {
    this.loadDealers();
  }

  trackById(index: number, item: any) {
    return item.id;
  }

  loadDealers(silent: boolean = false) {
    if (!silent) this.isLoading = true;
    this.dealerService.getAllDealers().subscribe({
      next: (data) => {
        this.dealers = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.showStatus("System error: Could not fetch dealers.", "error");
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  saveDealer() {
    if (this.dealerForm.invalid) {
      this.showStatus("Input required: Please fill all dealer details.", "error");
      return;
    }

    this.isLoading = true;

    if (this.isEditing && this.editingId) {
      // Smooth Update Flow
      this.dealerService.updateDealer(this.editingId, this.dealerForm.value).subscribe({
        next: (res) => {
          // Robust local update
          const updatedDealer = res;
          const index = this.dealers.findIndex(d => String(d.id) === String(this.editingId));
          if (index !== -1) {
            this.dealers[index] = { ...this.dealers[index], ...updatedDealer };
          }
          
          this.showStatus("Dealer profile updated successfully! ✨", "success");
          this.exitEditMode();
          this.isLoading = false;
          
          // Background sync
          this.loadDealers(true);
        },
        error: (err) => this.handleError(err)
      });
    } else {
      // Registration Flow
      this.dealerService.addDealer(this.dealerForm.value).subscribe({
        next: (newDealer) => {
          this.dealers = [newDealer, ...this.dealers];
          this.showStatus("New dealer registered successfully! 🤝", "success");
          this.resetForm();
          this.isLoading = false;
          this.loadDealers(true);
        },
        error: (err) => this.handleError(err)
      });
    }
  }

  editDealer(d: any) {
    console.log("[DEBUG] Editing Dealer:", d);
    this.isEditing = true;
    this.editingId = d.id;
    
    // Ensure the form is populated correctly
    this.dealerForm.patchValue({
      firstName: d.firstName,
      lastName: d.lastName,
      email: d.email,
      phone: d.phone,
      address: d.address,
      state: d.state,
      district: d.district,
      businessName: d.businessName,
      gstNumber: d.gstNumber,
      bankAccountNumber: d.bankAccountNumber,
      bankName: d.bankName,
      ifscCode: d.ifscCode
    });

    // Visual feedback
    const element = document.getElementById('dealerFormCard');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    this.cdr.detectChanges();
  }

  cancelEdit() {
    this.exitEditMode();
  }

  private exitEditMode() {
    this.isEditing = false;
    this.editingId = null;
    this.resetForm();
  }

  private resetForm() {
    this.dealerForm.reset();
    this.isLoading = false;
    this.cdr.detectChanges();
  }

  private showStatus(msg: string, type: 'success' | 'error') {
    this.statusMessage = msg;
    this.statusType = type;
    setTimeout(() => {
      this.statusMessage = '';
      this.cdr.detectChanges();
    }, 5000);
  }

  private handleError(err: any) {
    this.isLoading = false;
    this.showStatus("Operation failed. Server unreachable.", "error");
    console.error(err);
  }
}
