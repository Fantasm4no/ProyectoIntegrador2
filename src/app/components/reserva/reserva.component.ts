import { Component, OnInit } from '@angular/core';
import { Reserva } from '../../model/reservas';
import { Usuario } from '../../model/usuario';
import { Libro } from '../../model/libro';
import { AuthService } from '../../services/auth.service';
import { UsuariosService } from '../../services/usuarios.service';
import { LibrosService } from '../../services/libros.service';
import { ReservaService } from '../../services/reserva.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reserva.component.html',
  styleUrl: './reserva.component.scss'
})
export default class ReservasComponent implements OnInit {
  
  reservas?: Reserva[];
  username: string | null = null;
  usuarios: Usuario[] = [];
  libros: Libro[] = [];
  libroId: number | null = null;
  usuarioActual: Usuario | null = null;
  libroActual: Libro | null = null;
  newReserva: Reserva = {
    fechaReserva: '',
    libro: {
      libroId: 0,
      titulo: '',
      autor: '',
      contenido: '',
      genero: '',
      edicion: 0,
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
    },
    reservado: true
  };

  errorMessage: string = '';
  showError: boolean = false;

  successMessage: string = '';
  showSuccess: boolean = false;
  reminders: string[] = [];
  role: string | null = null

  constructor(
    private authService: AuthService,
    private userService: UsuariosService,
    private libroService: LibrosService,
    private reservaService: ReservaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    this.libroId = this.authService.getLibroId();
    this.role = this.authService.getRole();
    this.cargarUsuarios();
    this.cargarLibros();
    this.cargarReservasPendientes();
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

  cargarReservasPendientes(): void {
    this.reservaService.obtenerReservasActivas().subscribe({
      next: (data: Reserva[]) => {
        // Filtrar reservas por el usuario actual
        this.reservas = data.filter(reserva => reserva.usuario.username === this.username);
      },
      error: (error) => {
        console.error('Error al cargar reservas pendientes:', error);
      }
    });
  }

  cargarLibros(): void {
    this.libroService.obtenerLibros().subscribe({
      next: (data: Libro[]) => {
        this.libros = data.filter(libro => libro.disponibilidad);
        console.log('Libros cargados:', this.libros);
        this.filtrarLibroActual();  // Mueve esta línea aquí
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
      console.log('Buscando libro con ID:', this.libroId);
      this.libroActual = this.libros.find(libro => libro.libroId === this.libroId) || null;
      if (this.libroActual) {
        console.log('Libro encontrado:', this.libroActual);
      } else {
        console.log('Libro no encontrado');
      }
    }
  }  

  onLibroChange(event: any): void {
    const libroId = +event.target.value;
    this.libroActual = this.libros.find(libro => libro.libroId === libroId) || null;
  } 
  

  createReserva(): void {
    console.log('Creando reserva...');
    if (this.usuarioActual && this.libroActual) {
      console.log('Usuario actual:', this.usuarioActual);
      console.log('Libro actual:', this.libroActual);
  
      const fechaReservaInput = (document.getElementById('fechaReserva') as HTMLInputElement)?.value;
      console.log('Fecha de reserva input:', fechaReservaInput);
  
      if (fechaReservaInput) {
        const fechaReserva = new Date(fechaReservaInput);
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Reset time to start of the day
  
        // Check if the reservation date is at least 7 days from today
        const minReservaDate = new Date(now);
        minReservaDate.setDate(now.getDate() + 7);
  
        if (fechaReserva < minReservaDate) {
          this.errorMessage = 'La fecha de reserva debe ser al menos 7 días a partir de hoy.';
          this.showError = true;
          console.log('Error: La fecha de reserva es demasiado cercana.');
          setTimeout(() => {
            this.errorMessage = '';
            this.showError = false;
          }, 5000); // Ocultar el mensaje después de 5 segundos
          return;
        }
  
        this.showError = false; // Reset error message if no issues
  
        const offsetMs = fechaReserva.getTimezoneOffset() * 60 * 1000;
        const fechaReservaLocal = new Date(fechaReserva.getTime() + offsetMs);
  
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();
        const currentSeconds = now.getSeconds();
  
        fechaReservaLocal.setHours(currentHours, currentMinutes, currentSeconds, 0);
  
        this.newReserva.fechaReserva = fechaReservaLocal.toISOString();
  
        // Llenar los detalles de libro y usuario
        this.newReserva.libro = this.libroActual;
        this.newReserva.usuario = this.usuarioActual;
  
        const reserva: Reserva = {
          fechaReserva: this.newReserva.fechaReserva,
          libro: this.newReserva.libro,
          usuario: this.newReserva.usuario,
          reservado: true
        };
  
        console.log('Reserva a enviar:', reserva);
  
        this.reservaService.realizarReserva(reserva).subscribe({
          next: (reserva: Reserva) => {
            console.log('Reserva realizada con éxito:', reserva);
            if (!this.reservas) this.reservas = [];
            this.reservas.push(reserva);
            if (this.libroActual && this.libroActual.libroId !== undefined) {
              this.actualizarDisponibilidadLibro(this.libroActual.libroId, false);
            }
            this.resetForm();
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/reservas']);
            });
          },
          error: (error) => {
            console.error('Error al registrar la reserva:', error);
            this.errorMessage = 'Ocurrió un error al registrar la reserva. Por favor, inténtelo nuevamente.';
            this.showError = true;
            setTimeout(() => {
              this.errorMessage = '';
              this.showError = false;
            }, 5000); // Ocultar el mensaje después de 5 segundos
          }
        });
      } else {
        console.error('Fecha de reserva no proporcionada.');
      }
    } else {
      if (!this.usuarioActual) {
        console.error('Usuario actual no encontrado.');
      }
      if (!this.libroActual) {
        console.error('Libro actual no encontrado.');
      }
    }
  }
  

  actualizarDisponibilidadLibro(libroId: number, disponibilidad: boolean): void {
    const libro = this.libros.find(libro => libro.libroId === libroId);
    if (libro) {
      libro.disponibilidad = disponibilidad;
      this.libroService.actualizarLibro(libro).subscribe({
        next: () => {
          console.log('Disponibilidad del libro actualizada:', libro);
        },
        error: (error) => console.error('Error al actualizar disponibilidad del libro:', error)
      });
    }
  }

  resetForm(): void {
    this.newReserva = {
      fechaReserva: '',
      libro: {
        libroId: 0,
        titulo: '',
        autor: '',
        contenido: '',
        genero: '',
        edicion: 0,
        portada: '',
        disponibilidad: false,
        reservado:false
      },
      usuario: {
        usuarioId: 0,
        username: '',
        password: '',
        email: '',
        role: ''
      },
      reservado: true
    };
  }

  cancelarReserva(reservaId: number): void {
    this.reservaService.cancelarReserva(reservaId).subscribe({
      next: () => {
        console.log(`Reserva con ID ${reservaId} cancelada.`);
        // Actualizar lista de reservas activas
      },
      error: (error) => {
        console.error('Error al cancelar la reserva:', error);
      }
    });
  }

  logout(): void {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('role');
    window.location.href = 'http://192.168.177.138:8080/biblioteca(1)/LoginUsu.xhtml';
  }
}