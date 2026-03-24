import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  // URL base para el API
  private apiUrl = environment?.apiUrl || 'http://localhost:3000/api';

  // Usamos un Signal para mantener el estado de autenticación (si es que la UI lo necesita)
  isAuthenticated = signal<boolean>(false);

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, data, { withCredentials: true });
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, data, { withCredentials: true }).pipe(
      tap(() => this.isAuthenticated.set(true))
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/logout`, {}, { withCredentials: true }).pipe(
      tap(() => this.isAuthenticated.set(false))
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/forgot-password`, { email }, { withCredentials: true });
  }

  resetPassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/reset-password`, data, { withCredentials: true });
  }
}
