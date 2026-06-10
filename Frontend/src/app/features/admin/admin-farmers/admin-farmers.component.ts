import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FarmerService } from '../../../core/services/farmer.service';
import { Farmer } from '../../../shared/models/farmer.model';

@Component({
  selector: 'app-admin-farmers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="admin-container">
      <!-- 🔹 HEADER -->
      <header class="page-header">
        <div class="header-left">
          <h1 class="page-title">Farmer Management</h1>
          <p class="page-subtitle">Admin control panel for farmer data and performance tracking</p>
        </div>
        <div class="header-right">
          <div class="header-actions">
            <input type="text" [(ngModel)]="searchTerm" (input)="applyFilter()" placeholder="Search by name, email, phone..." class="search-box">

            <button (click)="loadFarmers()" class="btn-load-main" [disabled]="isLoading">
               🔄 Load Farmers
            </button>
          </div>
        </div>
      </header>

      <!-- 💡 SYNC SUCCESS INDICATOR -->
      <div class="sync-toast" *ngIf="syncSuccess">
        <span>✅ Changes saved & synced perfectly</span>
      </div>

      <!-- 📦 MAIN CARD -->
      <div class="main-card">
        
        <!-- 📊 TABLE STATE (Always Visible) -->
        <div class="table-container">

          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Farmer Name</th>
                <th>Contact Details</th>
                <th>State</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <!-- Data Rows -->
              <tr *ngFor="let farmer of filteredFarmers">
                <td><span class="id-tag">#{{ farmer.id }}</span></td>
                <td class="name-col">{{ farmer.firstName }} {{ farmer.lastName }}</td>
                <td>
                  <div class="contact-email">{{ farmer.email }}</div>
                  <div class="contact-phone">{{ farmer.phone }}</div>
                </td>
                <td>{{ farmer.state }}</td>
                <td>
                  <button (click)="openEditModal(farmer)" class="btn-edit">Edit Profile</button>
                </td>
              </tr>
              
              <!-- 📭 EMPTY STATE INSIDE TABLE -->
              <tr *ngIf="!isLoading && filteredFarmers.length === 0">
                <td colspan="5" class="empty-row">
                  <div class="empty-state-mini">
                    <span class="empty-icon-mini">🌾</span>
                    <p>{{ searchTerm ? 'No matching farmers found' : 'No farmers registered yet.' }}</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div class="modal-backdrop" *ngIf="showEditModal" (click)="closeModal()">
      <div class="modal-card large fade-in" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>Edit Farmer Profile</h3>
          <button (click)="closeModal()" class="btn-close">×</button>
        </div>
        <form [formGroup]="editForm" (ngSubmit)="onUpdate()" class="edit-form">
          <div class="modal-body">
            <div class="form-grid">
              <div class="section-title">Personal Details</div>
              <div class="form-group">
                <label>First Name</label>
                <input type="text" formControlName="firstName" class="form-control">
              </div>
              <div class="form-group">
                <label>Last Name</label>
                <input type="text" formControlName="lastName" class="form-control">
              </div>
              <div class="form-group">
                <label>Email</label>
                <input type="email" formControlName="email" class="form-control">
              </div>
              <div class="form-group">
                <label>Phone</label>
                <input type="text" formControlName="phone" class="form-control">
              </div>

              <div class="section-title">Location & ID</div>
              <div class="form-group">
                <label>State</label>
                <input type="text" formControlName="state" class="form-control">
              </div>
              <div class="form-group">
                <label>District</label>
                <input type="text" formControlName="district" class="form-control">
              </div>
              <div class="form-group full">
                <label>Aadhar Number</label>
                <input type="text" formControlName="aadharNumber" class="form-control">
              </div>

              <div class="form-group full">
                <label>Full Address</label>
                <input type="text" formControlName="address" class="form-control" placeholder="Village, Landmark, Area...">
              </div>

              <div class="section-title">Financial Details</div>
              <div class="form-group">
                <label>Bank Name</label>
                <input type="text" formControlName="bankName" class="form-control">
              </div>
              <div class="form-group">
                <label>IFSC Code</label>
                <input type="text" formControlName="ifscCode" class="form-control">
              </div>
              <div class="form-group">
                <label>Account Number</label>
                <input type="text" formControlName="bankAccountNumber" class="form-control">
              </div>
              <div class="form-group">
                <label>Rating (0-5)</label>
                <input type="number" formControlName="rating" class="form-control" step="0.1" min="0" max="5">
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" (click)="closeModal()" class="btn-secondary">Cancel</button>
            <button type="submit" [disabled]="editForm.invalid || isSubmitting" class="btn-primary">
              {{ isSubmitting ? 'Saving Changes...' : 'Update Profile' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .admin-container { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
    .page-title { margin: 0; color: #2e7d32; font-size: 2rem; font-weight: 800; }
    .page-subtitle { color: #666; margin: 0.25rem 0 0; }
    
    .header-actions { display: flex; align-items: center; gap: 1rem; }
    .search-box { padding: 0.7rem 1rem; border: 1.5px solid #2e7d32; border-radius: 10px; width: 300px; outline: none; }
    
    .btn-add { background: #2e7d32; color: #fff; border: none; padding: 0.7rem 1.5rem; border-radius: 10px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
    .btn-add:hover { background: #1b5e20; transform: translateY(-1px); }
    
    .btn-load-main { background: #f0f4f0; color: #2e7d32; border: 1.5px solid #2e7d32; padding: 0.7rem 1.2rem; border-radius: 10px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
    .btn-load-main:hover { background: #e8f5e9; }
    .main-card { background: #fff; border-radius: 16px; padding: 1.5rem; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #f0f0f0; min-height: 300px; position: relative; transition: all 0.3s ease; }
    .loading-fade { opacity: 0.8; pointer-events: none; }
    
    .table-status { position: absolute; top: 1rem; right: 2rem; display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: #2e7d32; font-weight: 700; background: #e8f5e9; padding: 4px 12px; border-radius: 20px; z-index: 10; }
    .refresh-spinner { width: 12px; height: 12px; border: 2px solid #2e7d32; border-top: 2px solid transparent; border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

    .table-container { overflow-x: auto; }
    .data-table { width: 100%; border-collapse: collapse; text-align: left; }
    .data-table th { padding: 1.2rem 1rem; border-bottom: 2px solid #f0f0f0; color: #888; text-transform: uppercase; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.5px; }
    .data-table td { padding: 1.2rem 1rem; border-bottom: 1px solid #f9f9f9; vertical-align: middle; transition: background 0.2s; }
    .data-table tr:hover { background: #fafafa; }
    
    .id-tag { background: #f5f5f5; padding: 0.3rem 0.6rem; border-radius: 6px; font-weight: 700; font-size: 0.8rem; color: #666; }
    .name-col { font-weight: 700; color: #1b1b1b; }
    .contact-email { color: #1565c0; font-size: 0.9rem; }
    .contact-phone { color: #666; font-size: 0.85rem; margin-top: 2px; }
    .rating-col { font-weight: 800; color: #f57c00; }
    
    .btn-edit { background: transparent; color: #2e7d32; border: 1.5px solid #2e7d32; padding: 0.4rem 1rem; border-radius: 8px; cursor: pointer; font-weight: 700; transition: all 0.2s; }
    .btn-edit:hover:not(:disabled) { background: #2e7d32; color: #fff; }
    .btn-edit:disabled { opacity: 0.5; cursor: not-allowed; }

    .empty-row { text-align: center; padding: 4rem 0 !important; color: #bbb; }
    .empty-state-mini { display: flex; flex-direction: column; align-items: center; gap: 8px; }
    .empty-icon-mini { font-size: 2rem; opacity: 0.5; }

    /* Modal Styling */
    .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-card { background: #fff; border-radius: 20px; width: 100%; max-width: 500px; padding: 2rem; box-shadow: 0 20px 50px rgba(0,0,0,0.2); }
    .modal-card.large { max-width: 800px; }
    .fade-in { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }

    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .modal-header h3 { margin: 0; color: #2e7d32; font-weight: 800; font-size: 1.5rem; }
    .btn-close { background: none; border: none; font-size: 2rem; cursor: pointer; color: #999; }
    
    .modal-body { max-height: 70vh; overflow-y: auto; padding-right: 1rem; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; }
    .section-title { grid-column: span 2; font-size: 0.8rem; font-weight: 800; color: #2e7d32; text-transform: uppercase; letter-spacing: 1px; margin-top: 1rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem; }
    .section-title:first-child { margin-top: 0; }
    
    .form-group.full { grid-column: span 2; }
    .form-group label { display: block; font-size: 0.85rem; margin-bottom: 0.4rem; font-weight: 700; color: #555; }
    .form-control { width: 100%; padding: 0.75rem; border: 1.5px solid #eee; border-radius: 10px; box-sizing: border-box; outline: none; transition: all 0.2s; }
    .form-control:focus { border-color: #2e7d32; box-shadow: 0 0 0 4px rgba(46,125,50,0.1); }
    
    .modal-footer { margin-top: 2rem; display: flex; justify-content: flex-end; gap: 1rem; }
    .btn-secondary { background: #f5f5f5; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer; font-weight: 600; color: #666; }
    .btn-primary { background: #2e7d32; color: #fff; border: none; padding: 0.8rem 2rem; border-radius: 10px; cursor: pointer; font-weight: 700; box-shadow: 0 4px 12px rgba(46,125,50,0.2); }
    .btn-primary:hover:not(:disabled) { background: #1b5e20; transform: translateY(-1px); }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

    .sync-toast { position: fixed; bottom: 2rem; right: 2rem; background: #2e7d32; color: #fff; padding: 1rem 2rem; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); font-weight: 700; z-index: 2000; animation: slideUp 0.3s ease-out; }
    @keyframes slideUp { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  `]
})
export class AdminFarmersComponent implements OnInit {
  private service = inject(FarmerService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  
  farmers: Farmer[] = [];
  filteredFarmers: Farmer[] = [];
  isLoading = false;
  isSubmitting = false;
  showEditModal = false;
  syncSuccess = false;
  searchTerm = '';
  
  editForm = this.fb.group({
    id: [''],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    address: [''],
    state: ['', Validators.required],
    district: ['', Validators.required],
    aadharNumber: [''],
    bankAccountNumber: [''],
    bankName: [''],
    ifscCode: [''],
    rating: [null]
  });

  ngOnInit() {
    // 🚀 Reactive Data Subscription for Always-Visible UI
    this.service.farmers$.subscribe(data => {
      this.farmers = data;
      this.applyFilter();
    });
    
    this.loadFarmers();
  }

  loadFarmers() {
    this.isLoading = true;
    this.service.getAllFarmers().subscribe({
      next: (res: any) => {
        console.log("[DEBUG] Admin Farmers Response Object:", res);
        
        let dataArray = [];

        // 1. Check for 'data' field (User's strict instruction)
        if (res && res.data) {
          if (Array.isArray(res.data)) {
            dataArray = res.data;
          } else if (res.data.content && Array.isArray(res.data.content)) {
            dataArray = res.data.content;
          } else if (typeof res.data === 'object') {
            // Check if 'data' is actually the farmer object itself
            if (res.data.firstName || res.data.email || res.data.id) {
              dataArray = [res.data];
            } else {
              // Deep search for any array within res.data
              const keys = Object.keys(res.data);
              for (const key of keys) {
                if (Array.isArray(res.data[key])) {
                  dataArray = res.data[key];
                  break;
                }
              }
            }
          }
        } 
        // 2. Fallback to direct array response
        else if (Array.isArray(res)) {
          dataArray = res;
        }

        console.log("[DEBUG] Final Extracted Farmer Array:", dataArray);
        this.farmers = dataArray;
        this.applyFilter();
        this.isLoading = false;
      },
      error: (err) => {
        console.error("[ERROR] API Call Failed:", err);
        this.isLoading = false;
        alert("Could not load farmers. Please check if the backend is running at http://localhost:8087");
      }
    });
  }

  applyFilter() {
    const term = (this.searchTerm || '').trim().toLowerCase();
    console.log("[DEBUG] Applying filter with term:", term, "on total farmers:", this.farmers.length);
    
    if (!term) {
      this.filteredFarmers = [...this.farmers];
      return;
    }
    
    this.filteredFarmers = this.farmers.filter((f: any) => {
      // Safe check for each field to prevent crashes (cast to any for legacy field support)
      const fn = (f.firstName || f.first_name || '').toLowerCase();
      const ln = (f.lastName || f.last_name || '').toLowerCase();
      const em = (f.email || '').toLowerCase();
      const ph = (f.phone || '').toString();
      const st = (f.state || '').toLowerCase();
      const id = (f.id || '').toString();

      return fn.includes(term) || ln.includes(term) || em.includes(term) || ph.includes(term) || st.includes(term) || id.includes(term);
    });
    
    console.log("[DEBUG] Filtered results count:", this.filteredFarmers.length);
  }

  goToRegister() {
    this.router.navigate(['/farmer/add']);
  }

  openEditModal(farmer: Farmer) {
    this.editForm.patchValue(farmer as any);
    this.showEditModal = true;
  }

  closeModal() {
    this.showEditModal = false;
    this.editForm.reset();
  }

  onUpdate() {
    if (this.editForm.invalid) return;
    
    this.isSubmitting = true;
    const formVal = this.editForm.value;
    
    // 🛠️ DUAL-MAPPING PAYLOAD (Ensures all credentials sync perfectly with any backend naming)
    const payload: any = {
      ...formVal,
      first_name: formVal.firstName,
      last_name: formVal.lastName,
      aadhar_number: formVal.aadharNumber,
      bank_account_number: formVal.bankAccountNumber,
      bank_name: formVal.bankName,
      ifsc_code: formVal.ifscCode
    };

    console.log("[DEBUG] Sending perfected payload for sync:", payload);

    // 🚀 OPTIMISTIC UPDATE: Instant UI feedback
    const originalFarmers = [...this.farmers];
    const index = this.farmers.findIndex(f => f.id === payload.id);
    if (index !== -1) {
      this.farmers[index] = { ...this.farmers[index], ...payload };
      this.applyFilter();
    }

    this.service.updateFarmer(payload.id!, payload).subscribe({
      next: (res: any) => {
        console.log("[DEBUG] Server sync successful:", res);
        this.isSubmitting = false;
        this.closeModal();
        
        // ✨ Visual confirmation
        this.syncSuccess = true;
        setTimeout(() => this.syncSuccess = false, 3000);
      },
      error: (err) => {
        this.isSubmitting = false;
        // Revert on error
        this.farmers = originalFarmers;
        this.applyFilter();
        console.error("[ERROR] Sync failed:", err);
        alert("Failed to sync changes. Please verify your connection.");
      }
    });
  }
}
