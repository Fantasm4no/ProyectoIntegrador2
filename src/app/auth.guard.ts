// src/app/auth.guard.ts
import { AuthService } from './services/auth.service';
import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    // Solo ejecutamos la lógica de guardia en el navegador
    if (authService.isAuthenticated()) {
      return true;
    } else {
      window.location.href = 'http://192.168.177.138:8080/biblioteca(1)/LoginUsu.xhtml'; 
      return false;
    }
  } else {
    // Si no estamos en el navegador, permitimos el acceso
    return true;
  }
};







