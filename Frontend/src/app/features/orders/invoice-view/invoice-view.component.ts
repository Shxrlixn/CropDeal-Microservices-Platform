import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { CropService } from '../../../core/services/crop.service';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-invoice-view',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="search-section no-print">
        <h1 class="page-title">🧾 Invoice Hub</h1>
        <p class="page-subtitle">Instant retrieval and printing of transaction documentation</p>
        
        <div class="search-box">
          <div class="input-wrapper">
            <span class="search-icon">🔍</span>
            <input type="text" [(ngModel)]="searchOrderId" (ngModelChange)="onIdChange($event)" 
                   (keyup.enter)="loadInvoice()"
                   class="form-control" placeholder="Enter Order Reference ID...">
          </div>
          <div *ngIf="isLoading" class="sync-indicator">
            <span class="rotating">🔄</span> Syncing...
          </div>
        </div>
        
        <div *ngIf="statusMsg" class="alert alert-error">{{ statusMsg }}</div>
      </div>

      <div *ngIf="invoice" class="invoice-frame animate-up">
        <div class="invoice-paper">
          <!-- Watermark -->
          <div class="watermark">SECURED</div>

          <!-- Invoice Top -->
          <div class="invoice-top">
            <div class="brand-block">
              <span class="brand-emoji">🌾</span>
              <div class="brand-text">
                <div class="brand-name">CropDeal</div>
                <div class="brand-tag">Agricultural Micro-Exchange</div>
              </div>
            </div>
            <div class="meta-block">
              <h2 class="doc-title">TAX INVOICE</h2>
              <div class="meta-grid">
                <span class="label">Reference:</span>
                <span class="value highlight">#{{ searchOrderId }}</span>
                <span class="label">Date:</span>
                <span class="value">{{ currentDate | date:'mediumDate' }}</span>
                <span class="label">Status:</span>
                <span class="value status-badge">PAID</span>
              </div>
            </div>
          </div>

          <!-- Billing Section -->
          <div class="billing-grid">
            <div class="billing-col">
              <div class="col-header">Farmer Details</div>
              <div class="entity-card">
                <span class="entity-icon">🧑‍🌾</span>
                <div class="entity-details">
                  <div class="entity-name">{{ invoice.farmerName || 'Registered Farmer' }}</div>
                  <div class="entity-id">ID: {{ invoice.farmerId }}</div>
                  <div class="entity-loc">Direct Producer</div>
                </div>
              </div>
            </div>
            <div class="billing-col">
              <div class="col-header">Dealer Details</div>
              <div class="entity-card">
                <span class="entity-icon">🤝</span>
                <div class="entity-details">
                  <div class="entity-name">{{ invoice.dealerName || 'Verified Dealer' }}</div>
                  <div class="entity-id">ID: {{ invoice.dealerId }}</div>
                  <div class="entity-loc">Licensed Buyer</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Items Table -->
          <div class="items-section">
            <table class="invoice-table">
              <thead>
                <tr>
                  <th>Produce Description</th>
                  <th class="text-center">Quantity</th>
                  <th class="text-right">Unit Price</th>
                  <th class="text-right">Line Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div class="item-desc">
                      <span class="item-icon">🌾</span>
                      <div>
                        <div class="item-name">{{ invoice.cropName || getCropName(invoice.cropId) }}</div>
                        <div class="item-id">REF: {{ invoice.cropId }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="text-center font-bold">{{ invoice.quantity }} kg</td>
                  <td class="text-right">₹{{ invoice.price }}</td>
                  <td class="text-right font-bold price-text">₹{{ invoice.totalAmount || (invoice.quantity * invoice.price) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Calculation Area -->
          <div class="calc-section">
            <div class="calc-box">
              <div class="calc-row">
                <span>Subtotal</span>
                <span>₹{{ invoice.totalAmount || (invoice.quantity * invoice.price) }}</span>
              </div>
              <div class="calc-row">
                <span>Tax (GST 0%)</span>
                <span>₹0.00</span>
              </div>
              <div class="calc-divider"></div>
              <div class="calc-row total">
                <span>Total Amount</span>
                <span class="grand-total">₹{{ invoice.totalAmount || (invoice.quantity * invoice.price) }}</span>
              </div>
            </div>
          </div>

          <div class="legal-footer">
            <p>This is a computer-generated document secured via CropDeal Hub. No signature required.</p>
            <div class="footer-line"></div>
            <div class="footer-dots">...</div>
          </div>
        </div>

        <div class="action-footer no-print">
          <button (click)="printInvoice()" class="btn-print">
            🖨️ Print Document
          </button>
          <a routerLink="/orders/history" class="btn-back">
            Return to Repository
          </a>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!invoice && !isLoading && searchOrderId" class="empty-state animate-up no-print">
        <div class="empty-visual">📂</div>
        <h3>No Document Found</h3>
        <p>We couldn't locate an invoice for Reference #{{ searchOrderId }}. Please check the ID and try again.</p>
      </div>
    </div>
  `,
  styles: [`
    .page-container { max-width: 900px; margin: 0 auto; padding: 20px 0; }
    .search-section { text-align: center; margin-bottom: 40px; }
    .page-title { font-size: 2.2rem; color: #1e293b; margin-bottom: 8px; font-weight: 800; }
    .page-subtitle { color: #64748b; font-size: 1rem; margin-bottom: 24px; }

    .search-box { max-width: 500px; margin: 0 auto; position: relative; }
    .input-wrapper { position: relative; display: flex; align-items: center; }
    .search-icon { position: absolute; left: 18px; color: #94a3b8; font-size: 1.2rem; }
    .form-control { width: 100%; padding: 16px 20px 16px 52px; border: 2px solid #e2e8f0; border-radius: 16px; font-size: 1.1rem; font-weight: 600; color: #1e293b; transition: all 0.2s; background: #fff; box-shadow: 0 4px 6px rgba(0,0,0,0.02); }
    .form-control:focus { border-color: #3b82f6; outline: none; box-shadow: 0 0 0 4px rgba(59,130,246,0.1); transform: translateY(-2px); }
    
    .sync-indicator { margin-top: 12px; font-size: 0.85rem; color: #3b82f6; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px; }
    .rotating { animation: spin 1s linear infinite; display: inline-block; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

    .invoice-frame { position: relative; }
    .invoice-paper { 
      background: #fff; border-radius: 4px; box-shadow: 0 20px 50px rgba(0,0,0,0.1); 
      border: 1px solid #e2e8f0; padding: 60px; position: relative; overflow: hidden;
      min-height: 800px;
    }
    
    .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 8rem; font-weight: 900; color: rgba(0,0,0,0.02); pointer-events: none; }

    .invoice-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 60px; }
    .brand-block { display: flex; gap: 16px; align-items: center; }
    .brand-emoji { font-size: 3.5rem; }
    .brand-name { font-size: 2.2rem; font-weight: 900; color: #0f172a; line-height: 1; }
    .brand-tag { font-size: 0.85rem; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; }

    .doc-title { font-size: 2rem; font-weight: 900; color: #1e293b; margin: 0 0 16px 0; text-align: right; }
    .meta-grid { display: grid; grid-template-columns: auto 1fr; gap: 8px 16px; text-align: right; font-size: 0.95rem; }
    .meta-grid .label { color: #64748b; font-weight: 600; }
    .meta-grid .value { color: #1e293b; font-weight: 800; }
    .meta-grid .highlight { color: #3b82f6; }
    .status-badge { background: #dcfce7; color: #166534; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; }

    .billing-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 60px; }
    .col-header { font-size: 0.75rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; }
    .entity-card { display: flex; gap: 16px; align-items: flex-start; }
    .entity-icon { font-size: 1.8rem; background: #f8fafc; padding: 12px; border-radius: 12px; }
    .entity-name { font-size: 1.1rem; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
    .entity-id { font-size: 0.85rem; color: #3b82f6; font-weight: 700; }
    .entity-loc { font-size: 0.85rem; color: #64748b; font-weight: 500; }

    .invoice-table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
    .invoice-table th { padding: 16px 0; text-align: left; font-size: 0.75rem; color: #64748b; text-transform: uppercase; border-bottom: 2px solid #0f172a; }
    .invoice-table td { padding: 24px 0; border-bottom: 1px solid #f1f5f9; font-size: 1rem; color: #1e293b; }
    
    .item-desc { display: flex; gap: 16px; align-items: center; }
    .item-icon { font-size: 1.5rem; }
    .item-name { font-weight: 800; font-size: 1.1rem; }
    .item-id { font-size: 0.75rem; color: #94a3b8; font-weight: 600; font-family: monospace; }
    
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .font-bold { font-weight: 800; }
    .price-text { color: #0f172a; font-size: 1.1rem; }

    .calc-section { display: flex; justify-content: flex-end; }
    .calc-box { width: 320px; }
    .calc-row { display: flex; justify-content: space-between; padding: 12px 0; font-size: 1rem; color: #64748b; font-weight: 600; }
    .calc-divider { height: 1px; background: #e2e8f0; margin: 8px 0; }
    .calc-row.total { padding-top: 16px; }
    .calc-row.total span { font-size: 1.1rem; font-weight: 800; color: #0f172a; }
    .grand-total { font-size: 2.2rem !important; color: #3b82f6 !important; font-weight: 900 !important; }

    .legal-footer { margin-top: 100px; text-align: center; color: #94a3b8; font-size: 0.8rem; font-weight: 500; }
    .footer-line { height: 2px; background: #f1f5f9; margin: 20px 0; }
    .footer-dots { font-size: 1.5rem; letter-spacing: 10px; color: #e2e8f0; }

    .action-footer { margin-top: 32px; display: flex; justify-content: center; gap: 20px; }
    .btn-print { background: #0f172a; color: #fff; border: none; padding: 16px 32px; border-radius: 12px; font-weight: 800; cursor: pointer; transition: all 0.2s; }
    .btn-print:hover { background: #1e293b; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
    .btn-back { background: #fff; color: #64748b; border: 1px solid #e2e8f0; padding: 16px 32px; border-radius: 12px; font-weight: 800; cursor: pointer; text-decoration: none; transition: all 0.2s; }
    .btn-back:hover { background: #f8fafc; color: #0f172a; }

    .empty-state { text-align: center; padding: 80px; background: #fff; border-radius: 24px; border: 2px dashed #e2e8f0; margin-top: 20px; }
    .empty-visual { font-size: 4rem; margin-bottom: 20px; opacity: 0.3; }
    .empty-state h3 { font-size: 1.4rem; color: #1e293b; margin-bottom: 8px; font-weight: 800; }
    .empty-state p { color: #64748b; }

    .animate-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

    .alert { padding: 16px; border-radius: 12px; margin-top: 20px; font-weight: 700; }
    .alert-error { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }

    @media print {
      .no-print { display: none !important; }
      .page-container { padding: 0; max-width: none; }
      .invoice-paper { box-shadow: none !important; border: none !important; padding: 0 !important; }
      .grand-total { color: black !important; }
    }
  `]
})
export class InvoiceViewComponent implements OnInit, OnDestroy {
  private orderService = inject(OrderService);
  private cropService = inject(CropService);
  private route = inject(ActivatedRoute);

  searchOrderId: string = '';
  invoice: any = null;
  isLoading = false;
  statusMsg = '';
  currentDate = new Date();
  crops: any[] = [];

  private searchSubject = new Subject<any>();

  ngOnInit() {
    this.cropService.crops$.subscribe(data => this.crops = data);
    this.cropService.getAllCrops().subscribe();

    // Setup debounced search - ultra fast 150ms
    this.searchSubject.pipe(
      debounceTime(150),
      distinctUntilChanged()
    ).subscribe(id => {
      if (id) {
        this.loadInvoice(id);
      } else {
        this.invoice = null;
        this.statusMsg = '';
      }
    });

    // Check for query params (from History tab)
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.searchOrderId = id.toString();
        this.loadInvoice(id);
      }
    });
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }

  onIdChange(newId: string) {
    if (newId && newId.trim().length > 0 && newId !== '0' && newId !== '-1') {
      // 🚀 SYNCHRONOUS CACHE CHECK (True Instant)
      const cached = this.orderService.getOrderById(newId);
      if (cached) {
        this.invoice = cached;
        this.statusMsg = '';
        this.isLoading = false;
        console.log('[FAST-LOAD] Synchronous cache hit!');
      }
      this.searchSubject.next(newId);
    } else {
      this.invoice = null;
      this.statusMsg = '';
    }
  }

  loadInvoice(id?: any) {
    const orderId = id || this.searchOrderId;
    if (!orderId || orderId.toString().trim().length === 0 || orderId === '0' || orderId === '-1') {
      this.invoice = null;
      return;
    }
    
    this.statusMsg = '';
    
    // 🛡️ STRICT HISTORY VALIDATION
    const cachedOrder = this.orderService.getOrderById(orderId);
    
    if (!cachedOrder) {
      // If not in cache, we might need to fetch history first to be sure
      this.isLoading = true;
      this.orderService.getOrders().subscribe({
        next: (orders) => {
          this.isLoading = false;
          const found = this.orderService.getOrderById(orderId);
          if (found) {
            this.fetchFullInvoice(orderId, found);
          } else {
            this.invoice = null;
            this.statusMsg = `🚫 Order #${orderId} not found in your history.`;
          }
        },
        error: () => {
          this.isLoading = false;
          this.statusMsg = '⚠️ Could not verify order history.';
        }
      });
      return;
    }

    this.fetchFullInvoice(orderId, cachedOrder);
  }

  private fetchFullInvoice(orderId: any, cachedData: any) {
    this.invoice = cachedData; // Show cached data immediately
    this.isLoading = true;
    
    this.orderService.getInvoice(orderId).subscribe({
      next: (data) => {
        this.isLoading = false;
        if (data && (data.id || data.orderId || Object.keys(data).length > 0)) {
          this.invoice = data;
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('[ERROR] Failed to refresh invoice details:', err);
      }
    });
  }

  getCropName(id: any): string {
    const crop = this.crops.find(c => c.id.toString() === id.toString());
    return crop ? (crop.cropName || crop.name) : 'Agricultural Stock';
  }

  printInvoice() {
    window.print();
  }
}
