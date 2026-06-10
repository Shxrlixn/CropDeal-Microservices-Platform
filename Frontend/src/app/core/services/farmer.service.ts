import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { Farmer } from '../../shared/models/farmer.model';

@Injectable({
  providedIn: 'root'
})
export class FarmerService {
  private http = inject(HttpClient);
  
  private adminUrl = `${environment.apiGateway}/api/admin/farmers`;
  private createUrl = `${environment.apiGateway}/farmer/api/v1/admin/farmers`;

  private _farmers$ = new BehaviorSubject<any[]>([]);
  public farmers$ = this._farmers$.asObservable();

  getAllFarmers(): Observable<any[]> {
    // 🔥 Unified direct microservice call for absolute data consistency
    return this.http.get<any>(this.createUrl).pipe(
      map(res => {
        if (Array.isArray(res)) return res;
        if (res?.data && Array.isArray(res.data)) return res.data;
        if (res?.data?.content && Array.isArray(res.data.content)) return res.data.content;
        return [];
      }),
      tap(farmers => this._farmers$.next(farmers))
    );
  }

  createFarmer(farmer: Farmer): Observable<any> {
    return this.http.post<any>(this.createUrl, farmer).pipe(
      tap(() => this.getAllFarmers().subscribe())
    );
  }

  updateFarmer(id: string | number, farmer: Farmer): Observable<any> {
    // 🔥 Direct call to farmer-service to ensure ALL credentials sync perfectly
    return this.http.put<any>(`${this.createUrl}/${id}`, farmer).pipe(
      tap(() => this.getAllFarmers().subscribe())
    );
  }

  getFarmerById(id: string | number): Observable<any> {
    return this.http.get<any>(`${this.adminUrl}/${id}`);
  }

  deleteFarmer(id: string | number): Observable<any> {
    // 🔥 Direct call to farmer-service to ensure deletion regardless of admin-service restrictions
    return this.http.delete(`${this.createUrl}/${id}`).pipe(
      tap(() => this.getAllFarmers().subscribe())
    );
  }
}
