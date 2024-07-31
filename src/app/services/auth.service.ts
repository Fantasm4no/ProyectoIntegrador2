import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import  jwtDecode  from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth/login';
  private _libroId: number | null = null;
  private disponibilidadOriginal: boolean | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private http: HttpClient) {}

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(this.apiUrl, credentials).pipe(
      tap((response: any) => {
        const token = response.token;
        if (token) {
          localStorage.setItem('jwtToken', token);
        }
      })
    );
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('jwtToken');
    if (!token) return false;

    try {
      const decodedToken: any = jwtDecode(token);
      const expirationDate = new Date(decodedToken.exp * 1000);
      return expirationDate > new Date();
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return false;
    }
  }

  logout() {
    localStorage.removeItem('jwtToken');
  }


  private isTokenValid(token: string): boolean {
    try {
      const decodedToken: any = jwtDecode(token);
      const expirationDate = new Date(decodedToken.exp * 1000);
      return expirationDate > new Date();
      console.log("token"+decodedToken);
    } catch (error) {
      return false;
    }
  }

  setToken(token: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('jwtToken', token);
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('jwtToken');
    }
    return null;
  }

  setUsername(username: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('username', username);
    }
  }

  getUsername(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('username');
    }
    return null;
  }

  setRole(role: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('role', role);
    }
  }

  getRole(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('role');
    }
    return null;
  }

  setLibroId(libroId: number) {
    this._libroId = libroId;
  }

  getLibroId() {
    return this._libroId;
  }

  setDisponibilidadOriginal(disponibilidad: boolean) {
    this.disponibilidadOriginal = disponibilidad;
  }

  getDisponibilidadOriginal(): boolean | null {
    return this.disponibilidadOriginal;
  }
}