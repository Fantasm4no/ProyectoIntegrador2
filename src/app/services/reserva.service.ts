import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reserva } from '../model/reservas';
import { Libro } from '../model/libro';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {

  private apiUrl = 'http://localhost:8080/biblioteca/rs/reservas';

  constructor(private http: HttpClient) { }

  obtenerReservas(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(this.apiUrl);
  }

  guardarReserva(reserva: Reserva): Observable<Reserva> {
    return this.http.post<Reserva>(this.apiUrl, reserva);
  }

  realizarReserva(reserva: Reserva): Observable<Reserva> {
    return this.http.post<Reserva>(this.apiUrl, reserva);
  }

  obtenerReservasActivas(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.apiUrl}/activas`);
  }
  
  cancelarReserva(reservaId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/cancelar/${reservaId}`, {});
  }

  obtenerReservasActivasPorUsuario(userId: number): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.apiUrl}/activas/${userId}`);
  }
}
