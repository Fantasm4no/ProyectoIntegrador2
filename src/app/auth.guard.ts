// src/app/auth.guard.ts
import { AuthService } from './services/auth.service';
import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser} from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); // Inyecta el servicio de autenticación
  const router = inject(Router); // Inyecta el router para redirección
  const platformId = inject(PLATFORM_ID); // Inyecta el PLATFORM_ID para verificar el entorno

  // Verifica si el usuario está autenticado
  if (isPlatformBrowser(platformId)) {
    const token = authService.getToken();
    
    if (token) {
      // Si el token está presente, el usuario está autenticado
      return true;
    } else {
      setTimeout(() => {
        window.location.href = 'http://localhost:8080/biblioteca/LoginUsu.xhtml'; 
      }, 1000);
      return false;
    }
  } else {
    return false;
  }
};






