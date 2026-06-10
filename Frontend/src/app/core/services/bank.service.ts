import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BankDetails } from '../../shared/models/user.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BankService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiGateway}/user/api/v1/bank`;

  addBankDetails(details: BankDetails): Observable<any> {
    return this.http.post<any>(this.apiUrl, details).pipe(map(res => res.data));
  }

  getBankDetails(userId: string): Observable<BankDetails> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`).pipe(map(res => res.data));
  }
}
