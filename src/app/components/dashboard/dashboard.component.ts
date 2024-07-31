// src/app/components/dashboard/dashboard.component.ts
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Libro } from '../../model/libro';
import { LibrosService } from '../../services/libros.service';
import { NavigationEnd, RouterLink, RouterOutlet, Router, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { PrestamosService } from '../../services/prestamos.service';
import { Prestamo } from '../../model/prestamo';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  
  libros?: Libro[];
  newLibro: Libro = { titulo: '', edicion: 0, genero: '', autor: '', contenido: '', portada: '', disponibilidad: true , reservado: false};
  mostrarFormulario: boolean = false;
  mostrarWelcome: boolean = true;
  role: string | null = null;
  prestamos?: Prestamo[];
  reminders: string[] = [];
  username: string | null = null;

  constructor(
    private libroService: LibrosService, 
    private router: Router, 
    private activatedRoute: ActivatedRoute, 
    private authService: AuthService, 
    @Inject(PLATFORM_ID) private platformId: Object,
    private prestamoService: PrestamosService
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.role = localStorage.getItem('role'); // Recupera el rol desde localStorage

      this.activatedRoute.queryParams.subscribe(params => {
        const token = params['token'];
        if (token) {
          this.authService.setToken(token);

          const decodedToken: any = jwtDecode(token);
          if (decodedToken.sub) {
            this.authService.setUsername(decodedToken.sub);
          }

          if (decodedToken.role) {
            this.authService.setRole(decodedToken.role);
            this.role = this.authService.getRole();
          } else {
            console.log('Campo de rol no encontrado en el token');
          }
        }
      });
    }
    this.username = this.authService.getUsername();
    this.cargarEntregasPendientes();
  }

  cargarEntregasPendientes(): void {
    if (this.username) {
      this.prestamoService.obtenerPrestamosNoEntregadosPorUsuario(this.username).subscribe({
        next: (data: Prestamo[]) => {
          console.log('Préstamos no entregados recibidos:', data);
          this.prestamos = data;
          this.generarRecordatorios(); // Generar recordatorios después de cargar los préstamos
        },
        error: (error) => {
          console.error('Error al cargar entregas pendientes:', error);
        }
      });
    } else {
      console.error('No se puede cargar entregas pendientes, username no disponible');
    }
  }

  generarRecordatorios(): void {
    const now = new Date();
    this.reminders = this.prestamos?.filter(prestamo => new Date(prestamo.fechaDevolucion) > now)
      .map(prestamo => {
        const diasRestantes = Math.ceil((new Date(prestamo.fechaDevolucion).getTime() - now.getTime()) / (1000 * 3600 * 24));
        return `Recordatorio: Estimado "${prestamo.usuario.username}" El libro "${prestamo.libro.titulo}" debe ser devuelto en ${diasRestantes} días.`;
      }) || [];
  }

  createLibro(): void {
    this.libroService.guardarLibro(this.newLibro).subscribe(libro => {
      if (!this.libros) this.libros = [];
      this.libros.push(libro);
      this.resetForm();
    });
  }

  resetForm() {
    this.newLibro = { titulo: '', edicion: 0, genero: '', autor: '', contenido: '', portada: '', disponibilidad: true, reservado: false };
    this.mostrarFormulario = false;
  }

  logout() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('role');
    localStorage.removeItem("username");
    window.location.href = 'http://192.168.177.138:8080/biblioteca(1)/LoginUsu.xhtml';
  }
}
