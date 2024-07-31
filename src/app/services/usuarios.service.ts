import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../model/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private apiUrl = 'http://192.168.177.138:8080/biblioteca(1)/rs/auth'; 
  
  constructor(private http: HttpClient) { }

  obtenerUsuarios(): Observable<Usuario[]>{
    return this.http.get<Usuario[]>(this.apiUrl);
  }
}
