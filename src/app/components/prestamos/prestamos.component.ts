import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';
import { UsuariosService } from '../../services/usuarios.service';
import { Usuario } from '../../model/usuario';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LibrosService } from '../../services/libros.service';
import { Libro } from '../../model/libro';
import { PrestamosService } from '../../services/prestamos.service';
import { Prestamo } from '../../model/prestamo';

@Component({
  selector: 'app-prestamos',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './prestamos.component.html',
  styleUrls: ['./prestamos.component.scss']
})
export class PrestamosComponent implements OnInit {

  prestamos?: Prestamo[];
  username: string | null = null;
  usuarios: Usuario[] = [];
  libros: Libro[] = [];
  libroId: number | null = null;
  usuarioActual: Usuario | null = null;
  libroActual: Libro | null = null;
  newPrestamo: Prestamo = {
    fechaPrestamo: '',
    fechaDevolucion: '',
    libro: {
      libroId: 0,
      titulo: '',
      edicion: 0,
      genero: '',
      autor: '',
      contenido: '',
      portada: '',
      disponibilidad: false
    },
    usuario: {
      usuarioId: 0,
      username: '',
      password: '',
      email: '',
      role: ''
    }
  };

  constructor(private authService: AuthService, private userService: UsuariosService, 
              private libroService: LibrosService, private prestamoService: PrestamosService) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    this.libroId = this.authService.getLibroId();
    this.cargarUsuarios();
    this.cargarLibros();
  }

  cargarUsuarios(): void {
    this.userService.obtenerUsuarios().subscribe({
      next: (data: Usuario[]) => {
        this.usuarios = data;
        this.filtrarUsuarioActual();
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
      }
    });
  }

  cargarLibros(): void {
    this.libroService.obtenerLibros().subscribe({
      next: (data: Libro[]) => {
        this.libros = data;
        this.filtrarLibroActual();
      },
      error: (error) => {
        console.error('Error al cargar libros:', error);
      }
    });
  }

  filtrarUsuarioActual(): void {
    if (this.username) {
      this.usuarioActual = this.usuarios.find(usuario => usuario.username === this.username) || null;
      if (this.usuarioActual) {
        console.log('Usuario encontrado:', this.usuarioActual);
      } else {
        console.log('Usuario no encontrado');
      }
    }
  }

  filtrarLibroActual(): void {
    if (this.libroId) {
      this.libroActual = this.libros.find(libro => libro.libroId === this.libroId) || null;
      if (this.libroActual) {
        console.log('Libro encontrado:', this.libroActual);
      } else {
        console.log('Libro no encontrado');
      }
    }
  }

  createPrestamo(): void {
    if (this.usuarioActual && this.libroActual) {
      this.newPrestamo.usuario = this.usuarioActual;
      this.newPrestamo.libro = this.libroActual;

      // Convertir los objetos Date a cadenas en formato ISO 8601
      const fechaPrestamo = (document.getElementById('fechaPrestamo') as HTMLInputElement).value;
      const fechaDevolucion = (document.getElementById('fechaDevolucion') as HTMLInputElement).value;
      this.newPrestamo.fechaPrestamo = new Date(fechaPrestamo).toISOString();
      this.newPrestamo.fechaDevolucion = new Date(fechaDevolucion).toISOString();

      this.prestamoService.guardarPrestamo(this.newPrestamo).subscribe(prestamo => {
        if (!this.prestamos) this.prestamos = [];
        this.prestamos.push(prestamo);
        this.resetForm();
      });
    } else {
      console.error('Usuario o libro actual no encontrado.');
    }
  }

  resetForm(): void {
    this.newPrestamo = {
      fechaPrestamo: new Date().toISOString(),
      fechaDevolucion: new Date().toISOString(),
      libro: {
        libroId: 0,
        titulo: '',
        edicion: 0,
        genero: '',
        autor: '',
        contenido: '',
        portada: '',
        disponibilidad: false
      },
      usuario: {
        usuarioId: 0,
        username: '',
        password: '',
        email: '',
        role: ''
      }
    };
  }
  logout() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('role');
    window.location.href = 'http://localhost:8080/biblioteca/LoginUsu.xhtml';
  }
}
