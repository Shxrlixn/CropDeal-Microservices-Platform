import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Crop } from '../../shared/models/crop.model';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { CropService } from './crop.service';

@Injectable({
  providedIn: 'root'
})
export class DealerService {
  private http = inject(HttpClient);
  private cropService = inject(CropService);
  private apiUrl = `${environment.apiGateway}/dealer`;
  private adminApiUrl = `${environment.apiGateway}/admin/api/v1/admin/dealers`;

  constructor() {
    // ── Seamless Synchronization ─────────────────────────────────────────────
    // Listen to global crop updates (from CropService) and sync the dealer cache.
    // This ensures that when a crop is deleted in the Admin/Farmer panel, 
    // the Dealer's view is updated automatically.
    this.cropService.crops$.subscribe(crops => {
      if (crops && crops.length >= 0) {
        this._crops$.next(crops);
      }
    });
  }

  // ── Cache ──────────────────────────────────────────────────────────────────
  private _crops$ = new BehaviorSubject<any[]>([]);
  public crops$ = this._crops$.asObservable();

  private _dealers$ = new BehaviorSubject<any[]>([]);
  public dealers$ = this._dealers$.asObservable();

  getCrops(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/crops`).pipe(
      map(res => res.data || res || []),
      tap(crops => this._crops$.next(crops))
    );
  }

  buyCrop(id: string | number, qty: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/buy/${id}/${qty}`, {}).pipe(
      map(res => res.data || res),
      tap(() => {
        // Refresh both caches for seamless cross-panel updates
        this.getCrops().subscribe();
        this.cropService.getAllCrops().subscribe();
      })
    );
  }

  // Admin Methods
  getAllDealers(): Observable<any[]> {
    return this.http.get<any>(this.adminApiUrl).pipe(
      map(res => res.data || []),
      tap(dealers => this._dealers$.next(dealers))
    );
  }

  getDealerById(id: string | number): Observable<any> {
    return this.http.get<any>(`${this.adminApiUrl}/${id}`).pipe(
      map(res => res.data)
    );
  }

  addDealer(dealer: any): Observable<any> {
    return this.http.post<any>(this.adminApiUrl, dealer).pipe(
      map(res => res.data),
      tap(() => this.getAllDealers().subscribe())
    );
  }

  updateDealer(id: string | number, dealer: any): Observable<any> {
    return this.http.put<any>(`${this.adminApiUrl}/${id}`, dealer).pipe(
      map(res => res.data),
      tap(() => this.getAllDealers().subscribe())
    );
  }
}


