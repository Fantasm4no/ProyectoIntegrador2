import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Prestamo } from '../model/prestamo';

@Injectable({
  providedIn: 'root'
})
export class PrestamosService {

  private apiUrl = 'http://192.168.177.138:8080/biblioteca(1)/rs/prestamos';

  constructor(private http: HttpClient) { }

  obtenerPrestamo(): Observable<Prestamo[]> {
    return this.http.get<Prestamo[]>(this.apiUrl);
  }

  guardarPrestamo(prestamo: Prestamo): Observable<Prestamo> {
    return this.http.post<Prestamo>(this.apiUrl, prestamo);
  }

  obtenerPrestamosActivos(): Observable<Prestamo[]> {
    return this.http.get<Prestamo[]>(`${this.apiUrl}/activos`);
  }

  devolverPrestamo(prestamoId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/devolver/${prestamoId}`, {});
  }

  obtenerPrestamosNoEntregadosPorUsuario(username: string): Observable<Prestamo[]> {
    return this.http.get<Prestamo[]>(`${this.apiUrl}/entregados/usuario/${username}`);
  }

  entregarPrestamo(prestamoId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/entregar/${prestamoId}`, {});
  }
}