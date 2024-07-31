import { Component, OnInit } from '@angular/core';
import { Prestamo } from '../../model/prestamo';
import { PrestamosService } from '../../services/prestamos.service';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reporte',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './reporte.component.html',
  styleUrl: './reporte.component.scss'
})
export class ReporteUsuariosComponent implements OnInit {

  prestamos: Prestamo[] = [];
  usuarioMasActivo: { username: string; count: number } | null = null;
  autorMasPopular: { autor: string; count: number } | null = null;
  role: string | null = null

  constructor(private prestamoService: PrestamosService, private authService: AuthService) {}

  ngOnInit() {
    this.cargarPrestamos();
    this.role = this.authService.getRole()
  }

  cargarPrestamos(): void {
    this.prestamoService.obtenerPrestamo().subscribe({
      next: (data: Prestamo[]) => {
        this.prestamos = data;
        this.calcularUsuarioMasActivo();
        this.calcularAutorMasPopular();
        console.log('Préstamos cargados:', this.prestamos);
      },
      error: (error) => {
        console.error('Error al cargar prestamos:', error);
      }
    });
  }

  calcularUsuarioMasActivo(): void {
    const usuarioCount: { [key: string]: number } = {};

    this.prestamos.forEach(prestamo => {
      const username = prestamo.usuario.username;
      if (usuarioCount[username]) {
        usuarioCount[username]++;
      } else {
        usuarioCount[username] = 1;
      }
    });

    let maxCount = 0;
    let usuarioMasActivo = null;

    for (const username in usuarioCount) {
      if (usuarioCount[username] > maxCount) {
        maxCount = usuarioCount[username];
        usuarioMasActivo = { username, count: maxCount };
      }
    }

    this.usuarioMasActivo = usuarioMasActivo;
  }

  calcularAutorMasPopular(): void {
    const autorCount: { [key: string]: number } = {};

    this.prestamos.forEach(prestamo => {
      const autor = prestamo.libro.autor;
      if (autorCount[autor]) {
        autorCount[autor]++;
      } else {
        autorCount[autor] = 1;
      }
    });

    let maxCount = 0;
    let autorMasPopular = null;

    for (const autor in autorCount) {
      if (autorCount[autor] > maxCount) {
        maxCount = autorCount[autor];
        autorMasPopular = { autor, count: maxCount };
      }
    }
    this.autorMasPopular = autorMasPopular;
  }

  logout() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('role');
    localStorage.removeItem("username");
    window.location.href = 'http://localhost:8080/biblioteca/LoginUsu.xhtml';
  }
}
