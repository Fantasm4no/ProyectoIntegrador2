import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { LoadingComponent } from "./loading/loading.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadingComponent,CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  isLoading = true; // Inicialmente true para mostrar el componente de carga

  constructor(private router: Router) {}

  ngOnInit() {
    this.handleAuthentication();
  }

  private handleAuthentication() {
    // Verificar si hay un token en la URL
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      const token = url.searchParams.get('token');

      if (token) {
        // Guardar el token en el localStorage
        localStorage.setItem('jwtToken', token);
        this.storeTokenData(token);

        // Mostrar el componente de carga y redirigir después de un tiempo
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
          this.isLoading = false; // Ocultar el componente de carga
        }, 500); // Ajusta el tiempo según sea necesario
      } else {
        // Si no hay token en la URL, verificar el almacenamiento local
        this.decodeToken();
        this.isLoading = false; // Ocultar el componente de carga si no hay token
      }
    }
  }

  storeTokenData(token: string): void {
    try {
      const decodedToken: any = jwtDecode(token);
      localStorage.setItem("username", decodedToken.sub || '');
      localStorage.setItem("role", decodedToken.role || '');
    } catch (error) {
      console.error('Error al decodificar el token:', error);
    }
  }

  decodeToken(): void {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        console.log('Token Decodificado:', decodedToken);
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    } else {
      console.log('No hay token en el almacenamiento local.');
    }
  }
}


