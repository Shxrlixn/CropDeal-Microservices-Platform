import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FarmerService } from '../../../core/services/farmer.service';

@Component({
  selector: 'app-farmer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page-container">
      <header class="page-header">
        <h1 class="page-title">👨‍🌾 Farmer Registration</h1>
        <p class="page-subtitle">Create a new farmer profile for the CropDeal ecosystem</p>
      </header>

      <div class="registration-card">
        <form [formGroup]="farmerForm" (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <!-- Basic Info -->
            <div class="section-header">Basic Information</div>
            <div class="form-group">
              <label>First Name</label>
              <input type="text" formControlName="firstName" placeholder="e.g. Aman" class="form-control">
            </div>
            <div class="form-group">
              <label>Last Name</label>
              <input type="text" formControlName="lastName" placeholder="e.g. Sharma" class="form-control">
            </div>
            <div class="form-group">
              <label>Email Address</label>
              <input type="email" formControlName="email" placeholder="aman@example.com" class="form-control">
            </div>
            <div class="form-group">
              <label>Phone Number</label>
              <input type="text" formControlName="phone" placeholder="9123456789" class="form-control">
            </div>

            <!-- Location -->
            <div class="section-header">Location Details</div>
            <div class="form-group">
              <label>State</label>
              <input type="text" formControlName="state" placeholder="e.g. Punjab" class="form-control">
            </div>
            <div class="form-group">
              <label>District</label>
              <input type="text" formControlName="district" placeholder="e.g. Ludhiana" class="form-control">
            </div>

            <!-- Verification & Banking -->
            <div class="section-header">Verification & Banking</div>
            <div class="form-group">
              <label>Aadhar Number</label>
              <input type="text" formControlName="aadharNumber" placeholder="12-digit number" class="form-control">
            </div>
            <div class="form-group">
              <label>Bank Name</label>
              <input type="text" formControlName="bankName" placeholder="e.g. HDFC" class="form-control">
            </div>
            <div class="form-group">
              <label>Bank Account Number</label>
              <input type="text" formControlName="bankAccountNumber" class="form-control">
            </div>
            <div class="form-group">
              <label>IFSC Code</label>
              <input type="text" formControlName="ifscCode" placeholder="IFSC12345" class="form-control">
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" [disabled]="farmerForm.invalid || isLoading" class="btn-submit">
              <span *ngIf="!isLoading">Register Farmer</span>
              <span *ngIf="isLoading">Processing...</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .page-container { max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
    .page-header { margin-bottom: 2rem; }
    .page-title { color: #2e7d32; font-size: 2rem; font-weight: 700; margin: 0; }
    .page-subtitle { color: #666; margin-top: 0.5rem; }

    .registration-card { background: #fff; padding: 2.5rem; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #f0f0f0; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .section-header { grid-column: span 2; font-weight: 700; color: #2e7d32; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 1px; margin-top: 1rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem; }
    .section-header:first-child { margin-top: 0; }
    
    .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
    .form-group label { font-size: 0.9rem; font-weight: 600; color: #444; }
    .form-control { padding: 0.8rem 1rem; border: 1.5px solid #eee; border-radius: 10px; font-size: 1rem; outline: none; transition: border-color 0.2s; }
    .form-control:focus { border-color: #2e7d32; }

    .form-actions { margin-top: 2.5rem; }
    .btn-submit { width: 100%; padding: 1rem; background: #2e7d32; color: #fff; border: none; border-radius: 12px; font-size: 1.1rem; font-weight: 700; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(46,125,50,0.2); }
    .btn-submit:hover:not(:disabled) { background: #1b5e20; transform: translateY(-2px); }
    .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

    @media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } .section-header { grid-column: span 1; } }
  `]
})
export class FarmerFormComponent {
  private fb = inject(FormBuilder);
  private service = inject(FarmerService);
  private router = inject(Router);

  isLoading = false;

  farmerForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    state: ['', Validators.required],
    district: ['', Validators.required],
    aadharNumber: [''],
    bankAccountNumber: [''],
    bankName: [''],
    ifscCode: [''],
    status: ['ACTIVE'], // 🔥 Added ACTIVE status by default
    rating: [null]
  });

  onSubmit() {
    if (this.farmerForm.invalid) return;

    this.isLoading = true;
    const payload = this.farmerForm.value;
    console.log("[DEBUG] Registering Farmer with payload:", payload);

    this.service.createFarmer(payload as any).subscribe({
      next: (res) => {
        this.isLoading = false;
        console.log("[SUCCESS] Farmer registered:", res);
        alert("Farmer registered successfully");
        this.router.navigate(['/admin/farmers']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error("[ERROR] Registration failed:", err);
        alert("Something went wrong. Please try again.");
      }
    });
  }
}
