import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FarmerService } from '../../../core/services/farmer.service';

@Component({
  selector: 'app-farmer-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="list-header">
        <div class="title-block">
          <h1 class="page-title">👨‍🌾 Farmer Registry</h1>
          <p class="page-subtitle">View and manage registered farmers on the platform</p>
        </div>
        <div class="header-actions">
          <input type="text" [(ngModel)]="searchTerm" (input)="applyFilter()" placeholder="Search registry..." class="search-registry">
          <button class="btn-load" (click)="loadFarmers()">
            🔄 Refresh List
          </button>
        </div>
      </div>

      <!-- 📊 DATA TABLE (Always Visible) -->
      <div class="table-card">
        <div class="table-meta">
          <span>{{ filteredFarmers.length }} results found</span>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Contact Details</th>
                <th>Location</th>
                <th class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <!-- Data Rows -->
              <tr *ngFor="let farmer of filteredFarmers">
                <td><span class="id-badge">#{{ farmer.id }}</span></td>
                <td class="name-cell">{{ farmer.firstName }} {{ farmer.lastName }}</td>
                <td>
                  <div class="email-text">{{ farmer.email }}</div>
                  <div class="phone-text">{{ farmer.phone || 'N/A' }}</div>
                </td>
                <td>
                  <span class="location-tag">📍 {{ farmer.district }}, {{ farmer.state }}</span>
                </td>
                <td class="text-center">
                  <button (click)="onDelete(farmer.id)" class="btn-delete-small">Delete</button>
                </td>
              </tr>
              
              <!-- 📭 EMPTY ROW -->
              <tr *ngIf="!isLoading && filteredFarmers.length === 0">
                <td colspan="5" class="empty-table-row">
                  <div class="empty-state-inner">
                    <span class="empty-icon-small">🌾</span>
                    <p>{{ searchTerm ? 'No matches found for "' + searchTerm + '"' : 'Registry is currently empty.' }}</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 1rem 0; max-width: 1200px; margin: 0 auto; }
    .list-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; flex-wrap: wrap; gap: 1.5rem; }
    .page-title { font-size: 2rem; color: #1b5e20; margin-bottom: 4px; font-weight: 800; }
    .page-subtitle { color: #666; font-size: 0.95rem; }

    .header-actions { display: flex; gap: 1rem; align-items: center; }
    .search-registry { padding: 0.8rem 1.2rem; border: 2px solid #e8f5e9; border-radius: 12px; width: 300px; outline: none; }
    .search-registry:focus { border-color: #2e7d32; }

    .btn-load { background: #2e7d32; color: #fff; padding: 0.8rem 1.5rem; border: none; border-radius: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
    .btn-load:hover:not(:disabled) { background: #1b5e20; }
    .btn-load:disabled { opacity: 0.5; }

    .table-card { background: #fff; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.05); border: 1px solid #e8f5e9; overflow: hidden; position: relative; }
    .loading-fade { opacity: 0.8; pointer-events: none; }
    
    .table-meta { padding: 1rem 1.5rem; background: #f9fdf9; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; font-size: 0.85rem; color: #888; font-weight: 700; }
    .refresh-indicator { color: #2e7d32; animation: pulse 1.5s infinite; }
    @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }

    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th { padding: 1.2rem 1rem; text-align: left; font-size: 0.75rem; color: #999; text-transform: uppercase; border-bottom: 2px solid #f0f0f0; }
    .data-table td { padding: 1.2rem 1rem; border-bottom: 1px solid #f9f9f9; }
    
    .id-badge { background: #f1f8e9; color: #2e7d32; padding: 4px 10px; border-radius: 8px; font-weight: 800; }
    .name-cell { font-weight: 700; color: #1b5e20; }
    
    .btn-delete-small { background: #fff; color: #d32f2f; border: 1.5px solid #ffcdd2; padding: 0.4rem 1rem; border-radius: 8px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
    .btn-delete-small:hover { background: #d32f2f; color: #fff; }

    .empty-table-row { text-align: center; padding: 5rem 0 !important; color: #bbb; }
    .empty-state-inner { display: flex; flex-direction: column; align-items: center; gap: 10px; }
    .empty-icon-small { font-size: 2.5rem; opacity: 0.5; }
    .text-center { text-align: center; }
  `]
})
export class FarmerListComponent implements OnInit {
  private farmerService = inject(FarmerService);

  farmers: any[] = [];
  filteredFarmers: any[] = [];
  isLoading = false;
  isDeleting: any = null;
  searchTerm = '';

  ngOnInit() {
    // 🚀 Reactive Stream for Always-Visible UI
    this.farmerService.farmers$.subscribe(data => {
      this.farmers = data;
      this.applyFilter();
    });
    
    this.loadFarmers();
  }

  loadFarmers() {
    this.isLoading = true;
    this.farmerService.getAllFarmers().subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  applyFilter() {
    const term = (this.searchTerm || '').trim().toLowerCase();
    if (!term) {
      this.filteredFarmers = [...this.farmers];
      return;
    }
    this.filteredFarmers = this.farmers.filter((f: any) => {
      const fn = (f.firstName || f.first_name || '').toLowerCase();
      const ln = (f.lastName || f.last_name || '').toLowerCase();
      const em = (f.email || '').toLowerCase();
      const ph = (f.phone || '').toString();
      const id = (f.id || '').toString();
      return fn.includes(term) || ln.includes(term) || em.includes(term) || ph.includes(term) || id.includes(term);
    });
  }

  onDelete(id: any) {
    if (!confirm('Are you sure you want to permanently delete this farmer record?')) return;
    
    this.isDeleting = id;
    this.farmerService.deleteFarmer(id).subscribe({
      next: () => {
        console.log("[DEBUG] Deletion successful for ID:", id);
        
        // 🚀 OPTIMISTIC DELETE (Zero Lag)
        this.farmers = this.farmers.filter(f => f.id !== id);
        this.applyFilter();
        
        this.isDeleting = null;
        
        // Silent background sync
        setTimeout(() => this.loadFarmers(), 800);
      },
      error: (err) => {
        this.isDeleting = null;
        console.error(err);
        alert('Could not delete farmer. They may have active dependencies.');
      }
    });
  }
}
