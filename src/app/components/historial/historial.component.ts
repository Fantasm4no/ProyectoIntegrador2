import { Component } from '@angular/core';
import { Usuario } from '../../model/usuario';
import { UsuariosService } from '../../services/usuarios.service';
import { PrestamosService } from '../../services/prestamos.service';
import { Prestamo } from '../../model/prestamo';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.scss'
})
export class HistorialComponent {

  prestamos: Prestamo[] = [];

  constructor(private prestamoService: PrestamosService) {}

  ngOnInit() {
    this.cargarPrestamos();
  }

  cargarPrestamos(): void {
    this.prestamoService.obtenerPrestamo().subscribe({
      next: (data: Prestamo[]) => {
        this.prestamos = data;
        console.log('Préstamos cargados:', this.prestamos); // Verifica los datos cargados
      },
      error: (error) => {
        console.error('Error al cargar prestamos:', error);
      }
    });
  }

  logout() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('role');
    localStorage.removeItem("username");
    window.location.href = 'http://localhost:8080/biblioteca/LoginUsu.xhtml';
  }
}