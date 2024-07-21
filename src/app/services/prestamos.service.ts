import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Prestamo } from '../model/prestamo';

@Injectable({
  providedIn: 'root'
})
export class PrestamosService {

  private apiUrl = 'http://localhost:8080/biblioteca/rs/prestamos'
  
  constructor(private http: HttpClient) { }

  obtenerPrestamo(): Observable<Prestamo[]> {
    return this.http.get<Prestamo[]>(this.apiUrl);
  }

  guardarPrestamo(prestamo: Prestamo): Observable<Prestamo> {
    return this.http.post<Prestamo>(this.apiUrl, prestamo);
  }
}
