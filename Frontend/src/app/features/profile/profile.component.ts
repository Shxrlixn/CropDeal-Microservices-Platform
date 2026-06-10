import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { UserStore } from '../../core/services/user.store';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">👤 My Profile</h1>
        <button (click)="loadProfile()" [disabled]="isLoading" class="btn-load">
          <span *ngIf="!isLoading">🔄 Refresh Profile</span>
          <span *ngIf="isLoading" class="loading-dots">Loading<span>.</span><span>.</span><span>.</span></span>
        </button>
      </div>

      <div *ngIf="message" class="alert" [class.alert-error]="isError" [class.alert-info]="!isError">
        {{ message }}
      </div>

      <!-- Profile Card -->
      <div class="profile-card">
        <div class="profile-banner">
          <div class="avatar">
            {{ (profile?.firstName || userStore.user()?.firstName || 'U').charAt(0).toUpperCase() }}
          </div>
          <div class="profile-info">
            <h2 class="profile-name">
              {{ profile?.firstName || userStore.user()?.firstName || '—' }}
              {{ profile?.lastName || userStore.user()?.lastName || '' }}
            </h2>
            <div class="profile-email">{{ profile?.email || userStore.user()?.email || '' }}</div>
          </div>
          <span class="role-badge">{{ profile?.role || userStore.role() || 'USER' }}</span>
        </div>

        <div class="profile-body">
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">📧 Email</div>
              <div class="info-value">{{ profile?.email || userStore.user()?.email || 'N/A' }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">📱 Phone</div>
              <div class="info-value">{{ profile?.phoneNumber || profile?.phone || 'N/A' }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">🎭 Role</div>
              <div class="info-value">
                <span class="chip chip-green">{{ profile?.role || userStore.role() || 'N/A' }}</span>
              </div>
            </div>
            <div class="info-item">
              <div class="info-label">✅ Status</div>
              <div class="info-value">
                <span class="chip chip-green">{{ profile?.status || 'ACTIVE' }}</span>
              </div>
            </div>
            <div class="info-item span-2">
              <div class="info-label">🏠 Address</div>
              <div class="info-value" *ngIf="profile?.address">
                {{ profile.address.houseNo ? profile.address.houseNo + ', ' : '' }}
                {{ profile.address.street ? profile.address.street + ', ' : '' }}
                {{ profile.address.city || '' }}
                {{ profile.address.zipCode ? ' — ' + profile.address.zipCode : '' }}
              </div>
              <div class="info-value muted" *ngIf="!profile?.address">Not provided</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { max-width: 720px; margin: 0 auto; padding: 8px 0; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; flex-wrap: wrap; gap: 16px; }
    .page-title { font-size: 1.8rem; color: #1b5e20; margin: 0; }

    .btn-load {
      background: linear-gradient(135deg, #1565c0, #1976d2); color: #fff;
      padding: 11px 22px; border: none; border-radius: 8px;
      font-weight: 600; cursor: pointer; transition: all 0.2s;
    }
    .btn-load:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(21,101,192,0.3); }
    .btn-load:disabled { opacity: 0.55; cursor: not-allowed; }

    .alert { padding: 14px 18px; border-radius: 8px; margin-bottom: 20px; font-weight: 500; }
    .alert-error { background: #ffebee; color: #c62828; border: 1px solid #ef9a9a; }
    .alert-info { background: #fff8e1; color: #e65100; border: 1px solid #ffe082; }

    .profile-card { background: #fff; border-radius: 16px; box-shadow: 0 6px 24px rgba(0,0,0,0.1); border: 1px solid #e8f5e9; overflow: hidden; }

    .profile-banner {
      background: linear-gradient(135deg, #1b5e20, #388e3c);
      padding: 28px 32px; display: flex; align-items: center; gap: 20px; flex-wrap: wrap;
    }
    .avatar {
      width: 72px; height: 72px; border-radius: 50%;
      background: rgba(255,255,255,0.25); border: 3px solid rgba(255,255,255,0.5);
      display: flex; align-items: center; justify-content: center;
      font-size: 2rem; font-weight: 800; color: #fff; flex-shrink: 0;
    }
    .profile-info { flex: 1; color: #fff; }
    .profile-name { margin: 0 0 4px 0; font-size: 1.5rem; font-weight: 700; }
    .profile-email { opacity: 0.85; font-size: 0.95rem; }
    .role-badge {
      background: rgba(255,255,255,0.2); color: #fff; padding: 6px 16px;
      border-radius: 20px; font-size: 0.85rem; font-weight: 700;
      border: 1px solid rgba(255,255,255,0.4); letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    .profile-body { padding: 28px 32px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    @media (max-width: 540px) { .info-grid { grid-template-columns: 1fr; } }
    .info-item { background: #f8fffe; border-radius: 10px; padding: 16px; border: 1px solid #e8f5e9; }
    .span-2 { grid-column: span 2; }
    @media (max-width: 540px) { .span-2 { grid-column: span 1; } }
    .info-label { font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.8px; color: #888; font-weight: 700; margin-bottom: 8px; }
    .info-value { font-size: 1rem; color: #333; font-weight: 500; }
    .muted { color: #aaa; font-style: italic; }

    .chip { padding: 4px 12px; border-radius: 20px; font-size: 0.82rem; font-weight: 700; display: inline-block; }
    .chip-green { background: #e8f5e9; color: #2e7d32; }

    .loading-dots span { animation: blink 1.2s infinite; animation-fill-mode: both; }
    .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
    .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes blink { 0%, 80%, 100% { opacity: 0; } 40% { opacity: 1; } }
  `]
})
export class ProfileComponent {
  userStore = inject(UserStore);
  private http = inject(HttpClient);

  profile: any = null;
  message = '';
  isError = false;
  isLoading = false;

  loadProfile() {
    this.isLoading = true;
    this.message = '';
    this.isError = false;

    const token = localStorage.getItem('token');
    if (!token) {
      this.isLoading = false;
      this.isError = true;
      this.message = 'No token found. Please log in.';
      return;
    }

    let email = '';
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      email = decoded?.sub || decoded?.email || '';
    } catch {
      this.isLoading = false;
      this.isError = true;
      this.message = 'Failed to decode token';
      return;
    }

    if (!email) {
      this.isLoading = false;
      this.isError = true;
      this.message = 'Email not found in token';
      return;
    }

    this.http.get(`${environment.apiGateway}/user/api/v1/users/email/${email}`).subscribe({
      next: (data: any) => {
        this.isLoading = false;
        this.profile = data?.data || data;
        this.message = '';
      },
      error: (err) => {
        this.isLoading = false;
        this.isError = true;
        this.message = err.status === 0 ? 'Backend not running' : err.status === 404 ? 'Profile not found' : 'Server error';
      }
    });
  }
}
