import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiGateway}/admin/api/v1/advanced-reports`;

  runCommand(command: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/commands`, command).pipe(map(res => res.data));
  }

  getQueries(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/queries`).pipe(map(res => res.data));
  }
}
