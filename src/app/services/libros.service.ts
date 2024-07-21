import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Libro } from '../model/libro';

@Injectable({
  providedIn: 'root'
})
export class LibrosService {

  private apiUrl = 'http://localhost:8080/biblioteca/rs/libros';

  constructor(private http: HttpClient) { }

  obtenerLibros(): Observable<Libro[]> {
    return this.http.get<Libro[]>(this.apiUrl);
  }

  eliminarLibro(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}?id=${id}`);
  }

  guardarLibro(libro: Libro): Observable<Libro> {
    return this.http.post<Libro>(this.apiUrl, libro);
  }

  actualizarLibro(libro: Libro): Observable<Libro> {
    return this.http.put<Libro>(this.apiUrl, libro);
  }

  libroPorId(id: number){
    return this.http.get<Libro[]>(`${this.apiUrl}/${id}`)
  }

}
