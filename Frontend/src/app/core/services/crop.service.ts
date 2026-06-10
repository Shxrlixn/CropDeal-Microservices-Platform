import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Crop, Receipt } from '../../shared/models/crop.model';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CropService {
  private http = inject(HttpClient);

  /** All crop CRUD requests go through the API Gateway */
  private baseUrl = `${environment.apiGateway}/crop/api/v1/crops`;

  /** Non-crop endpoints (subscriptions, receipts, buy) */
  private apiUrl = `${environment.apiGateway}/crop/api/v1`;

  // ── Cache ──────────────────────────────────────────────────────────────────
  private _crops$ = new BehaviorSubject<Crop[]>([]);
  public crops$ = this._crops$.asObservable();

  // ── Crop CRUD ──────────────────────────────────────────────────────────────

  addCrop(crop: Crop): Observable<Crop> {
    return this.http.post<any>(this.baseUrl, crop).pipe(
      map(res => res.data || res),
      tap(() => this.getAllCrops().subscribe()) // Background refresh
    );
  }

  getAllCrops(): Observable<Crop[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      map(res => res.data || res),
      tap(crops => this._crops$.next(crops))
    );
  }

  getCrop(id: string): Observable<Crop> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(map(res => res.data));
  }

  updateCrop(id: string, crop: Partial<Crop>): Observable<Crop> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, crop).pipe(
      map(res => res.data || res),
      tap(() => this.getAllCrops().subscribe()) // Background refresh
    );
  }

  deleteCrop(id: string | number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' }).pipe(
      tap(() => this.getAllCrops().subscribe()) // Background refresh
    );
  }

  getCropsByFarmer(farmerId: string): Observable<Crop[]> {
    return this.http.get<any>(`${this.baseUrl}/farmer/${farmerId}`).pipe(map(res => res.data));
  }

  // ── Other Endpoints ────────────────────────────────────────────────────────

  subscribe(subscriptionData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/subscribe`, subscriptionData);
  }

  addReceipt(receipt: Receipt): Observable<Receipt> {
    return this.http.post<any>(`${this.apiUrl}/receipt`, receipt).pipe(map(res => res.data));
  }

  buyCrop(id: string, qty: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/buy/${id}/${qty}`, {}).pipe(
      map(res => res.data),
      tap(() => this.getAllCrops().subscribe()) // Refresh cache
    );
  }

  getReceipts(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/receipts`).pipe(map(res => res.data));
  }
}


