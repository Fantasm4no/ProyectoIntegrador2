import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _role: string | null = null;
  private _username: string | null = null;
  private _libroId: number | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('jwtToken');
      return !!token && this.isTokenValid(token);
    }
    return false;
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
}

