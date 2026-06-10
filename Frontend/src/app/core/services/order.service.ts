import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiGateway}/order/api`;

  private _orders$ = new BehaviorSubject<any[]>([]);
  public orders$ = this._orders$.asObservable();

  createOrder(order: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/orders`, order).pipe(
      map(res => res.data || res),
      tap(() => this.getOrders().subscribe()) // Refresh cache
    );
  }

  getOrders(force: boolean = false): Observable<any[]> {
    if (!force && this._orders$.value.length > 0) {
      return this.orders$;
    }
    return this.http.get<any>(`${this.apiUrl}/orders`).pipe(
      map(res => res.data || res || []),
      tap(orders => this._orders$.next(orders))
    );
  }

  getOrderById(id: any): any | null {
    const orders = this._orders$.value;
    return orders.find(o => (o.id || o.orderId).toString() === id.toString()) || null;
  }

  getInvoice(orderId: string | number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/orders/${orderId}/invoice`).pipe(
      map(res => res.data || res)
    );
  }

  makePayment(payment: { orderId: number, amount: number }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/orders/payment`, payment).pipe(
      map(res => res.data || res),
      tap(() => this.getOrders().subscribe()) // Refresh cache if payment affects order status
    );
  }
}
