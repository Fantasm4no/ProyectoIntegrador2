import { Component, OnInit } from '@angular/core';
import { Libro } from '../../model/libro';
import { LibrosService } from '../../services/libros.service';
import { NavigationEnd, RouterLink, RouterOutlet, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
  
  libros?: Libro[];
  newLibro: Libro = { titulo: '', edicion: 0, genero: '', autor: '', contenido: '', portada: '' };
  mostrarFormulario: boolean = false; 
  mostrarWelcome: boolean = true;  // Variable para controlar la visibilidad de welcome

  constructor(private libroService: LibrosService, private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.mostrarWelcome = this.router.url === '/';
      }
    });
  }

  createLibro(): void {
    this.libroService.guardarLibro(this.newLibro).subscribe(libro => {
      if (!this.libros) this.libros = [];  // Asegura que 'libros' esté inicializado
      this.libros.push(libro);
      this.resetForm();
    });
  }

  resetForm() {
    this.newLibro = { titulo: '', edicion: 0, genero: '', autor: '', contenido: '', portada: '' };
    this.mostrarFormulario = false; // Oculta el formulario al reiniciarlo
  }
}
