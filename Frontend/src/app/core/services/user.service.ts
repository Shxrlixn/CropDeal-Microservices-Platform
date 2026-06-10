import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { User } from '../../shared/models/user.model';
import { Observable, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserStore } from './user.store';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private userStore = inject(UserStore);
  private apiUrl = `${environment.apiGateway}/user/api/v1`;

  getUsers(): Observable<User[]> {
    return this.http.get<any>(`${this.apiUrl}/users`).pipe(
      map(res => res.data || res)
    );
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<any>(`${this.apiUrl}/users/${id}`).pipe(
      map(res => res.data || res),
      tap(user => {
        this.userStore.setUser(user);
      })
    );
  }

  register(user: any): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users/register`, user);
  }
}
