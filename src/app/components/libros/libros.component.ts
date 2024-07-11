import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Libro } from '../../model/libro';
import { LibrosService } from '../../services/libros.service';

@Component({
  selector: 'app-libros',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './libros.component.html',
  styleUrl: './libros.component.scss'
})
export class LibrosComponent implements OnInit{

  isEditMode: boolean = false;
  libros: Libro[] = [];
  newLibro: Libro = { titulo: '', edicion: 0, genero: '', autor: '', contenido: '', portada: '' };
  
  constructor(private libroService: LibrosService) { }

  ngOnInit() {
    this.cargarLibros();
  }

  cargarLibros() {
    this.libroService.obtenerLibros().subscribe(libros => {
      this.libros = libros;
    });
  }

  eliminarLibro(libroId: number) {
    this.libroService.eliminarLibro(libroId).subscribe({
      next: () => this.cargarLibros(),
      error: error => console.error('Error al eliminar libro:', error)
    });
  }

  actualizarLibro() {
    this.libroService.actualizarLibro(this.newLibro).subscribe({
      next: (libroActualizado) => {
        console.log('Libro actualizado:', libroActualizado);
        this.cargarLibros();
        this.resetForm();
      },
      error: (error) => console.error('Error al actualizar libro:', error)
    });
  }

  resetForm() {
    this.newLibro = { titulo: '', edicion: 0, genero: '', autor: '', contenido: '', portada: '' };
    this.isEditMode = false;
  }

  seleccionarLibro(libro: Libro) {
    this.newLibro = { ...libro };
    this.isEditMode = true;
  }

  onSubmit() {
    if (this.isEditMode) {
      this.actualizarLibro();
    } else {
      console.log("No hay nada que crear");
    }
  }
}
