import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  // Based on the prompt: POST /api/v1/admin/farmers
  private apiUrl = `${environment.apiGateway}/admin/api/v1/admin`;

  // Farmers (for dashboard counts)
  getFarmers(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/farmers`).pipe(map(res => res.data || res || []));
  }

  getFarmer(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/farmers/${id}`).pipe(map(res => res.data));
  }

  addFarmer(farmer: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/farmers`, farmer).pipe(map(res => res.data));
  }

  updateFarmer(id: string, farmer: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/farmers/${id}`, farmer).pipe(map(res => res.data));
  }

  updateFarmerStatus(id: string, status: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/farmers/${id}/status`, { status }).pipe(map(res => res.data));
  }

  updateFarmerRating(id: string, rating: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/farmers/${id}/rating`, { rating }).pipe(map(res => res.data));
  }

  deleteFarmer(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/farmers/${id}`).pipe(map(res => res.data));
  }

  // Dealers (for dashboard counts)
  getDealers(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/dealers`).pipe(map(res => res.data || res || []));
  }

  getDealer(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dealers/${id}`).pipe(map(res => res.data));
  }

  addDealer(dealer: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/dealers`, dealer).pipe(map(res => res.data));
  }

  updateDealer(id: string, dealer: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/dealers/${id}`, dealer).pipe(map(res => res.data));
  }

  updateDealerStatus(id: string, status: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/dealers/${id}/status`, { status }).pipe(map(res => res.data));
  }

  deleteDealer(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/dealers/${id}`).pipe(map(res => res.data));
  }
}
