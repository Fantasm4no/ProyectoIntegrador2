import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Libro } from '../../model/libro';
import { LibrosService } from '../../services/libros.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-libros',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterLink],
  templateUrl: './libros.component.html',
  styleUrl: './libros.component.scss'
})
export class LibrosComponent implements OnInit {

  libros: Libro[] = [];
  newLibro: Libro = { titulo: '', edicion: 0, genero: '', autor: '', contenido: '', portada: ''};
  libroEditIndex: number | null = null
  searchQuery: string = '';

  constructor(private libroService: LibrosService) { }

  ngOnInit(): void {
    this.listarLibros();
  }

  listarLibros(): void {
    this.libroService.obtenerLibros().subscribe(
      (data: Libro[]) => {
        this.libros = data;
      },
      (error) => {
        console.error('Error al obtener libros', error);
      }
    );
  }

  searchLibros() {
    this.libroService.searchLibros(this.searchQuery).subscribe(
        (result) => {
            this.libros = result;
        },
        (error) => {
            console.error('Error fetching books', error);
        }
    );
}


  eliminarLibro(libroId: number) {
    this.libroService.eliminarLibro(libroId).subscribe({
      next: () => this.listarLibros(),
      error: error => console.error('Error al eliminar libro:', error)
    });
  }

  actualizarLibro() {
    if (this.libroEditIndex !== null) {
      this.libroService.actualizarLibro(this.newLibro).subscribe({
        next: (libroActualizado) => {
          console.log('Libro actualizado:', libroActualizado);
          this.listarLibros();
          this.resetForm();
        },
        error: (error) => console.error('Error al actualizar libro:', error)
      });
    }
  }

  resetForm() {
    this.newLibro = { titulo: '', edicion: 0, genero: '', autor: '', contenido: '', portada: ''};
    this.libroEditIndex = null
  }

  seleccionarLibro(libro: Libro, index: number) {
    this.newLibro = { ...libro };
    this.libroEditIndex = index
  }

  onSubmit() {
    if (this.libroEditIndex !== null) {
      this.actualizarLibro();
    }
  }
}
