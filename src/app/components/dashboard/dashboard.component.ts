import { Component, OnInit } from '@angular/core';
import { Libro } from '../../model/libro';
import { LibrosService } from '../../services/libros.service';
import { NavigationEnd, RouterLink, RouterOutlet, Router, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { jwtDecode  } from 'jwt-decode';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
  
  libros?: Libro[];
  newLibro: Libro = { titulo: '', edicion: 0, genero: '', autor: '', contenido: '', portada: '', disponibilidad: true };
  mostrarFormulario: boolean = false; 
  mostrarWelcome: boolean = true;
  username: string | null = null;
  role: string | null = null;

  constructor(private libroService: LibrosService, private router: Router, private activatedRoute: ActivatedRoute,) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        // Asegúrate de que el código solo se ejecute en el navegador
        if (typeof window !== 'undefined') {
          localStorage.setItem('jwtToken', token);

          const decodedToken: any = jwtDecode(token);
          console.log('Decoded Token:', decodedToken);

          // Acceder al campo 'sub' que contiene el nombre de usuario
          if (decodedToken.sub) {
            this.username = decodedToken.sub;
          } else {
            console.log('Campo de nombre de usuario no encontrado en el token');
          }
          if (decodedToken.role) {
            this.role = decodedToken.role;
          } else {
            console.log('Campo de rol no encontrado en el token');
          }

          console.log('Username:', this.username);
          console.log('Role:', this.role);
        }
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
    this.newLibro = { titulo: '', edicion: 0, genero: '', autor: '', contenido: '', portada: '', disponibilidad: true };
    this.mostrarFormulario = false; // Oculta el formulario al reiniciarlo
  }
}
