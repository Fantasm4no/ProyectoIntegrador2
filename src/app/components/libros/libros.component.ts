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

  libros?: Libro[];
  libroSeleccionado: Libro | null = null;

  constructor(private libroService: LibrosService) { }

  ngOnInit() {
    this.cargarClientes();
  }

  cargarClientes() {
    this.libroService.obtenerLibros().subscribe({
      next: (data: Libro[]) => this.libros = data,
      error: (error) => console.error('Error cargando clientes:', error)
    });
  }

  mostrarDetalles(libro: Libro): void {
    this.libroSeleccionado = this.libroSeleccionado === libro ? null : libro
  }
}
