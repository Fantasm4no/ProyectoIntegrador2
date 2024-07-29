import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Libro } from '../../model/libro';
import { LibrosService } from '../../services/libros.service';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-libros',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterLink],
  templateUrl: './libros.component.html',
  styleUrl: './libros.component.scss'
})
export class LibrosComponent implements OnInit {

  libros: Libro[] = [];
  newLibro: Libro = { titulo: '', edicion: 0, genero: '', autor: '', contenido: '', portada: '', disponibilidad: true};
  libroEditIndex: number | null = null;
  filteredLibros: Libro[] = []; 
  categorias: string[] = []; 
  autores: string[] = []; 
  searchTerm: string = '';
  selectedCategory: string = '';
  selectedAuthor: string = '';
  selectedAvailability: string = 'disponible';
  role: string | null = null;

  constructor(private libroService: LibrosService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.role = this.authService.getRole();
    this.cargarLibros();
  }

  cargarLibros() {
    this.libroService.obtenerLibros().subscribe({
      next: (data: Libro[]) => {
        this.libros = data;
        this.filteredLibros = data;
        this.categorias = [...new Set(data.map(libro => libro.genero))]; 
        this.autores = [...new Set(data.map(libro => libro.autor))]; 
        this.filtrarLibros();
      },
      error: (error: any) => console.error('Error al cargar libros:', error)
    });
  }

  filtrarLibros() {
    this.filteredLibros = this.libros.filter(libro => {
      const matchesTitle = libro.titulo.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = this.selectedCategory ? libro.genero === this.selectedCategory : true;
      const matchesAuthor = this.selectedAuthor ? libro.autor === this.selectedAuthor : true;
      const matchesAvailability = this.selectedAvailability ? (this.selectedAvailability === 'disponible' ? libro.disponibilidad : !libro.disponibilidad) : true;
      return matchesTitle && matchesCategory && matchesAuthor && matchesAvailability;
    });
  }

  eliminarLibro(libroId: number) {
    this.libroService.eliminarLibro(libroId).subscribe({
      next: () => this.cargarLibros(),
      error: error => console.error('Error al eliminar libro:', error)
    });
  }

  actualizarLibro() {
    if (this.libroEditIndex !== null) {
      this.libroService.actualizarLibro(this.newLibro).subscribe({
        next: (libroActualizado) => {
          console.log('Libro actualizado:', libroActualizado);
          this.cargarLibros();
          this.resetForm();
        },
        error: (error) => console.error('Error al actualizar libro:', error)
      });
    }
  }

  resetForm() {
    this.newLibro = { titulo: '', edicion: 0, genero: '', autor: '', contenido: '', portada: '', disponibilidad: true};
    this.libroEditIndex = null;
  }

  seleccionarLibro(libro: Libro, index: number) {
    this.newLibro = { ...libro };
    this.libroEditIndex = index;
  }

  onSubmit() {
    if (this.libroEditIndex !== null) {
      this.actualizarLibro();
    }
  }

  pedirLibro(libroId: number | undefined) {
    if (libroId !== undefined) {
      const libro = this.libros.find(libro => libro.libroId === libroId);
      if (libro) {
        // Guardar el libro seleccionado y su disponibilidad original en el servicio AuthService
        this.authService.setLibroId(libroId);
        this.authService.setDisponibilidadOriginal(libro.disponibilidad); // Guardar disponibilidad original
        this.router.navigate(['/prestamos']); // Redirigir al componente Prestamo
      } else {
        console.error('Libro no encontrado para el ID:', libroId);
      }
    } else {
      console.error('No se encontró el id');
    }
  }

  

  logout() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    window.location.href = 'http://localhost:8080/biblioteca/LoginUsu.xhtml';
  }
  
}
