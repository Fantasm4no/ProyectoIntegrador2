import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _role: string | null = null;
  private _username: string | null = null;
  private _libroId: number | null = null

  constructor() {}

  setRole(role: string) {
    this._role = role;
  }

  getRole(): string | null {
    return this._role;
  }

  setUsername(username: string){
    this._username = username;
  }

  getUsername(){
    return this._username
  }

  setLibroId(libroId: number){
    this._libroId = libroId
  }

  getLibroId(){
    return this._libroId
  }
}
