import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { UsuariosService } from '../../services/usuarios.service';
import { Usuario } from '../../model/usuario';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LibrosService } from '../../services/libros.service';
import { Libro } from '../../model/libro';
import { PrestamosService } from '../../services/prestamos.service';
import { Prestamo } from '../../model/prestamo';
import  jwtDecode  from 'jwt-decode';

@Component({
  selector: 'app-prestamos',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './prestamos.component.html',
  styleUrls: ['./prestamos.component.scss']
})
export class PrestamosComponent implements OnInit {
  decodedToken: any;
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
      disponibilidad: false,
      reservado: false
    },
    usuario: {
      usuarioId: 0,
      username: '',
      password: '',
      email: '',
      role: ''
    }
  };

  reminders: string[] = [];
  role: string | null = null;

  constructor(private authService: AuthService, private userService: UsuariosService, 
              private libroService: LibrosService, private prestamoService: PrestamosService,
              private router: Router) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    this.libroId = this.authService.getLibroId();
    this.role = this.authService.getRole();
    this.cargarUsuarios();
    this.cargarLibros();

    // Establecer la fecha actual en el campo de fecha de préstamo
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    this.newPrestamo.fechaPrestamo = `${year}-${month}-${day}`;

    // Cargar la disponibilidad original del libro
    const disponibilidadOriginal = this.authService.getDisponibilidadOriginal();
    if (this.libroId !== null && disponibilidadOriginal !== null) {
        const libro = this.libros.find(libro => libro.libroId === this.libroId);
        if (libro) {
            this.newPrestamo.libro.disponibilidad = disponibilidadOriginal;
        } else {
            console.error('Libro no encontrado para el ID:', this.libroId);
        }
    }
  }

  decodeToken(): void {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      this.decodedToken = jwtDecode(token);
    } else {
      console.log('No hay token en el almacenamiento local.');
    }
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
      console.log('Usuario actual filtrado:', this.usuarioActual); // Añade este log para verificar el usuario encontrado
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

      const fechaDevolucionInput = (document.getElementById('fechaDevolucion') as HTMLInputElement).value;

      if (fechaDevolucionInput) {
        const fechaDevolucion = new Date(fechaDevolucionInput);

        // Obtener la fecha y hora actuales
        const now = new Date();

        // Establecer la hora actual en la fecha de préstamo seleccionada
        const fechaPrestamoLocal = new Date(now);
        fechaPrestamoLocal.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), 0);

        const offsetMs = now.getTimezoneOffset() * 60 * 1000;
        const fechaDevolucionLocal = new Date(fechaDevolucion.getTime() + offsetMs);

        this.newPrestamo.fechaPrestamo = fechaPrestamoLocal.toISOString();
        this.newPrestamo.fechaDevolucion = fechaDevolucionLocal.toISOString();

        // Actualizar la disponibilidad del libro a false
        this.newPrestamo.libro.disponibilidad = false;

        this.prestamoService.guardarPrestamo(this.newPrestamo).subscribe(prestamo => {
          if (!this.prestamos) this.prestamos = [];
          this.prestamos.push(prestamo);

          // Actualizar la disponibilidad del libro en el servidor
          this.libroService.actualizarLibro(this.newPrestamo.libro).subscribe({
            next: () => {
              console.log('Libro actualizado a no disponible:', this.newPrestamo.libro);
              this.resetForm();
              this.router.navigate(['/libros']);
            },
            error: (error) => console.error('Error al actualizar libro:', error)
          });
        });
      } else {
        console.error('Fecha de devolución no proporcionada.');
      }
    } else {
      console.error('Usuario o libro actual no encontrado.');
    }
  }

  resetForm(): void {
    this.newPrestamo = {
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
        disponibilidad: false,
        reservado: false
      },
      usuario: {
        usuarioId: 0,
        username: '',
        password: '',
        email: '',
        role: ''
      }
    };

    // Restablecer el campo de fecha de préstamo con la fecha actual
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    this.newPrestamo.fechaPrestamo = `${year}-${month}-${day}`;
  }


  cancelar(): void {
    const libroId = this.authService.getLibroId();
    const disponibilidadOriginal = this.authService.getDisponibilidadOriginal();
    if (libroId !== null && disponibilidadOriginal !== null) {
      const libro = this.libros.find(libro => libro.libroId === libroId);
      if (libro) {
        libro.disponibilidad = disponibilidadOriginal;
        this.libroService.actualizarLibro(libro).subscribe({
          next: () => {
            console.log('Disponibilidad del libro restaurada:', libro);
            this.router.navigate(['/libros']);
          },
          error: (error) => console.error('Error al restaurar disponibilidad del libro:', error)
        });
      } else {
        console.error('Libro no encontrado para el ID:', libroId);
      }
    }
  }

  logout() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    window.location.href = 'http://localhost:8080/biblioteca/LoginUsu.xhtml';
  }
}
