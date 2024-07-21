import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../model/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private apiUrl = 'http://localhost:8080/biblioteca/rs/auth'; 
  
  constructor(private http: HttpClient) { }

  obtenerUsuarios(): Observable<Usuario[]>{
    return this.http.get<Usuario[]>(this.apiUrl);
  }
}
