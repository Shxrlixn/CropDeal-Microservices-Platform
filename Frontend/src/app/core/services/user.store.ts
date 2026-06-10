import { Injectable, signal } from '@angular/core';
import { User } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserStore {
  user = signal<User | null>(null);
  token = signal<string | null>(localStorage.getItem('token'));
  isAuthenticated = signal<boolean>(!!localStorage.getItem('token'));
  role = signal<'ADMIN' | 'FARMER' | 'DEALER' | 'ROLE_ADMIN' | 'ROLE_FARMER' | 'ROLE_DEALER' | null>(localStorage.getItem('role') as any);

  constructor() {
    this.hydrate();
  }

  private hydrate() {
    const token = localStorage.getItem('token');
    const savedRole = localStorage.getItem('role');
    const savedEmail = localStorage.getItem('email');

    if (token) {
      this.token.set(token);
      this.isAuthenticated.set(true);
      
      if (savedRole) {
        this.role.set(savedRole as any);
      } else {
        // Fallback to JWT decode if localStorage is missing role
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          // Keep the role as is from the token
          const roleFromToken = payload?.role || payload?.roles?.[0] || payload?.authorities?.[0];
          
          if (roleFromToken) {
            this.role.set(roleFromToken as any);
            localStorage.setItem('role', roleFromToken);
          }
        } catch (e) {}
      }

      if (savedEmail) {
        this.user.set({ email: savedEmail, role: this.role() } as any);
      }
    }
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
    this.token.set(token);
    this.isAuthenticated.set(true);
  }

  setUser(user: User) {
    this.user.set(user);
    this.role.set(user.role);
    localStorage.setItem('role', user.role);
    localStorage.setItem('email', user.email);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    this.token.set(null);
    this.user.set(null);
    this.role.set(null);
    this.isAuthenticated.set(false);
  }
}
