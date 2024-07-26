// src/app/components/dashboard/dashboard.component.ts
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Libro } from '../../model/libro';
import { LibrosService } from '../../services/libros.service';
import { NavigationEnd, RouterLink, RouterOutlet, Router, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  libros?: Libro[];
  newLibro: Libro = { titulo: '', edicion: 0, genero: '', autor: '', contenido: '', portada: '', disponibilidad: true };
  mostrarFormulario: boolean = false;
  mostrarWelcome: boolean = true;
  role: string | null = null;

  constructor(private libroService: LibrosService, private router: Router, private activatedRoute: ActivatedRoute, private authService: AuthService, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.role = localStorage.getItem('role'); // Recupera el rol desde localStorage

      this.activatedRoute.queryParams.subscribe(params => {
        const token = params['token'];
        if (token) {
          this.authService.setToken(token);

          const decodedToken: any = jwtDecode(token);
          if (decodedToken.sub) {
            this.authService.setUsername(decodedToken.sub);
          }

          if (decodedToken.role) {
            this.authService.setRole(decodedToken.role);
            this.role = this.authService.getRole();
          } else {
            console.log('Campo de rol no encontrado en el token');
          }
        }
      });
    }
  }

  createLibro(): void {
    this.libroService.guardarLibro(this.newLibro).subscribe(libro => {
      if (!this.libros) this.libros = [];
      this.libros.push(libro);
      this.resetForm();
    });
  }

  resetForm() {
    this.newLibro = { titulo: '', edicion: 0, genero: '', autor: '', contenido: '', portada: '', disponibilidad: true };
    this.mostrarFormulario = false;
  }

  logout() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('role');
    window.location.href = 'http://localhost:8080/biblioteca/LoginUsu.xhtml';
  }
}
