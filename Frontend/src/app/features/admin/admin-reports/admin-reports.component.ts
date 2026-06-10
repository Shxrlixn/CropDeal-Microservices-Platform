import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../../../core/services/report.service';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1 class="page-title">📊 Analytics & Reports</h1>
          <p class="page-subtitle">Advanced platform metrics and query results</p>
        </div>
        <button (click)="loadQueries()" [disabled]="isLoading" class="btn-refresh">
          <span *ngIf="!isLoading">🔄 Refresh Data</span>
          <span *ngIf="isLoading" class="loading-dots">Loading<span>.</span><span>.</span><span>.</span></span>
        </button>
      </div>

      <div *ngIf="errMsg" class="alert alert-error">{{ errMsg }}</div>

      <div class="report-card" *ngIf="!queriesData && !isLoading && !errMsg">
        <div class="empty-icon">📊</div>
        <p>Click "Refresh Data" to load the latest platform analytics.</p>
      </div>

      <div *ngIf="queriesData" class="data-card">
        <div class="data-header">
          <span class="data-title">📋 Query Results</span>
          <span class="data-badge">Live Data</span>
        </div>
        <pre class="data-pre">{{ queriesData | json }}</pre>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 8px 0; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; flex-wrap: wrap; gap: 16px; }
    .page-title { font-size: 1.8rem; color: #1b5e20; margin-bottom: 4px; margin-top: 0; }
    .page-subtitle { color: #6c757d; font-size: 0.95rem; margin: 0; }

    .btn-refresh {
      background: linear-gradient(135deg, #1565c0, #1976d2); color: #fff;
      padding: 12px 24px; border: none; border-radius: 8px;
      font-weight: 600; cursor: pointer; transition: all 0.2s;
    }
    .btn-refresh:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(21,101,192,0.3); }
    .btn-refresh:disabled { opacity: 0.55; cursor: not-allowed; }

    .alert { padding: 14px 18px; border-radius: 8px; margin-bottom: 20px; font-weight: 500; }
    .alert-error { background: #ffebee; color: #c62828; border: 1px solid #ef9a9a; }

    .report-card { text-align: center; padding: 60px 24px; background: #fff; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.05); border: 1px dashed #c8e6c9; }
    .empty-icon { font-size: 3rem; margin-bottom: 12px; }
    .report-card p { color: #888; margin: 0; }

    .data-card { background: #fff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e8f5e9; overflow: hidden; }
    .data-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; background: #fafafa; border-bottom: 1px solid #eee; }
    .data-title { font-weight: 700; color: #1b5e20; }
    .data-badge { background: #e8f5e9; color: #2e7d32; padding: 3px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 700; }
    .data-pre { margin: 0; padding: 20px; font-family: 'Courier New', monospace; font-size: 0.85rem; background: #f8fffe; color: #333; overflow-x: auto; white-space: pre-wrap; word-break: break-all; }

    .loading-dots span { animation: blink 1.2s infinite; animation-fill-mode: both; }
    .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
    .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes blink { 0%, 80%, 100% { opacity: 0; } 40% { opacity: 1; } }
  `]
})
export class AdminReportsComponent {
  private reportService = inject(ReportService);

  queriesData: any = null;
  isLoading = false;
  errMsg = '';

  ngOnInit() {
    this.loadQueries();
  }

  loadQueries() {
    this.isLoading = true;
    this.errMsg = '';
    this.reportService.getQueries().subscribe({
      next: (data: any) => { this.isLoading = false; this.queriesData = data; },
      error: (err: any) => {
        this.isLoading = false;
        this.errMsg = err.status === 0 ? 'Backend not running' : 'Failed to load report data';
      }
    });
  }
}
