import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthResponse, User } from '../../shared/models/user.model';
import { Observable, tap, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserStore } from './user.store';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private userStore = inject(UserStore);
  private apiUrl = `${environment.apiGateway}/auth`;

  login(email: string, password: string): Observable<any> {
    console.log('LOGIN REQUEST:', { email, password });
    return this.http.post(
      `${this.apiUrl}/login`,
      { email, password },
      { headers: { 'Content-Type': 'application/json' } }
    ).pipe(
      tap((response: any) => {
        console.log('LOGIN RESPONSE:', response);
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          // Also store role/email if backend returns them directly
          if (response.role) localStorage.setItem('role', response.role);
          if (response.email) localStorage.setItem('email', response.email);
        }
      })
    );
  }

  getUserProfile(email: string): Observable<User> {
    const userUrl = `${environment.apiGateway}/user/api/v1/users/email/${email}`;
    return this.http.get<User>(userUrl);
  }

  logout() {
    localStorage.removeItem('token');
    this.userStore.logout();
  }
}
