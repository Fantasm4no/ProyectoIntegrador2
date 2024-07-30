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
    this.username = this.authService.getUsername(); // Asegúrate de que esto se está estableciendo correctamente
    console.log('Username:', this.username); // Agrega un log para verificar el valor de username
    this.cargarEntregasPendientes()
    if(this.role == "admin"){
      this.cargarDevolucionesPendientes()
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
    if (this.username) {
      this.prestamoService.obtenerPrestamosNoEntregadosPorUsuario(this.username).subscribe({
        next: (data: Prestamo[]) => {
          console.log('Préstamos no entregados recibidos:', data);
          this.prestamos = data;
        },
        error: (error) => {
          console.error('Error al cargar entregas pendientes:', error);
        }
      });
    } else {
      console.error('No se puede cargar entregas pendientes, username no disponible');
    }
  }
  

   devolverPrestamo(prestamoId: number): void {
    this.prestamoService.devolverPrestamo(prestamoId).subscribe({
      next: () => {
        console.log('Préstamo devuelto con éxito');
        // Volver a cargar las entregas pendientes
        this.cargarEntregasPendientes();
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