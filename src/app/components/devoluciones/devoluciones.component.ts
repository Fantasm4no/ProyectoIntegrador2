import { Component, OnInit } from '@angular/core';
import { Prestamo } from '../../model/prestamo';
import { PrestamosService } from '../../services/prestamos.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UsuariosService } from '../../services/usuarios.service';
import { Usuario } from '../../model/usuario';

@Component({
  selector: 'app-devoluciones',
  standalone: true,
  imports: [ RouterLink, CommonModule],
  templateUrl: './devoluciones.component.html',
  styleUrl: './devoluciones.component.scss'
})
export class DevolucionesComponent implements OnInit {

  prestamos: Prestamo[] = [];
  usuarios: Usuario[] = [];
  usuarioActual: Usuario | null = null;
  role: string | null = null;
  username: string | null = null;

  constructor(private prestamoService: PrestamosService, private authService: AuthService, private userService: UsuariosService) {}

  ngOnInit(): void {
    this.role = this.authService.getRole();
      this.cargarDevolucionesPendientes();
      this.cargarEntregasPendientes()
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

  cargarDevolucionesPendientes(): void {
    this.prestamoService.obtenerPrestamosActivos().subscribe({
      next: (data: Prestamo[]) => {
        console.log('Prestamos activos recibidos:', data); // Log de los datos recibidos
        this.prestamos = data;
      },
      error: (error) => {
        console.error('Error al cargar devoluciones pendientes:', error);
      }
    });
  }

  cargarEntregasPendientes(): void {
    this.prestamoService.obtenerPrestamosNoEntregados().subscribe({
      next: (data: Prestamo[]) => {
        console.log('Prestamos activos recibidos:', data); // Log de los datos recibidos
        this.prestamos = data;
      },
      error: (error) => {
        console.error('Error al cargar devoluciones pendientes:', error);
      }
    });
  }

  devolverPrestamo(prestamoId: number): void {
    this.prestamoService.devolverPrestamo(prestamoId).subscribe({
      next: () => {
        console.log('Préstamo devuelto con éxito');
        // Volver a cargar las devoluciones pendientes
        this.cargarDevolucionesPendientes();
      },
      error: (error) => {
        console.error('Error al devolver el préstamo:', error);
      }
    });
  }

  entregarPrestamo(prestamoId: number): void {
    this.prestamoService.entregarPrestamo(prestamoId).subscribe({
      next: () => {
        console.log('Préstamo devuelto con éxito');
        // Volver a cargar las devoluciones pendientes
        this.cargarEntregasPendientes();
      },
      error: (error) => {
        console.error('Error al devolver el préstamo:', error);
      }
    });
  }

  logout() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    window.location.href = 'http://localhost:8080/biblioteca/LoginUsu.xhtml';
  }
}