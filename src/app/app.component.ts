import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LibrosService } from './services/libros.service';
import { Libro } from './model/libro';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  libros?: Libro[];
  newLibro: Libro = { titulo: '', edicion: 0, genero: '', autor: '', contenido: '', portada: '' };
  mostrarFormulario: boolean = false; 
  mostrarWelcome: boolean = true;  // Variable para controlar la visibilidad de welcome

  constructor(private libroService: LibrosService){}

  createLibro(): void {
    this.libroService.guardarLibro(this.newLibro).subscribe(libro => {
      this.libros?.push(libro);
      this.newLibro = { titulo: '', edicion: 0, genero: '', autor: '', contenido: '', portada: '' };
    });
  }

  resetForm() {
    this.newLibro = { titulo: '', edicion: 0, genero: '', autor: '', contenido: '', portada: '' };
    this.mostrarFormulario = false; // Muestra el formulario al reiniciarlo
  }

  ocultarFormulario(): void {
    this.mostrarFormulario = false;
  }

  ocultarWelcome(): void {
    this.mostrarWelcome = false;  // Método para ocultar welcome
  }
}
