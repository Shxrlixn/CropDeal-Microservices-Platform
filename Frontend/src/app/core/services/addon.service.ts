import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AddonService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiGateway}/admin/api/v1/addons`;

  getAddons(): Observable<any[]> {
    return this.http.get<any>(this.apiUrl).pipe(map(res => res.data));
  }

  addAddon(addon: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, addon).pipe(map(res => res.data));
  }

  updateAddonStatus(id: string, status: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/status`, { status }).pipe(map(res => res.data));
  }

  deleteAddon(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(map(res => res.data));
  }
}
