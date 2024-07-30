import { Routes } from '@angular/router';
import { LibrosComponent } from './components/libros/libros.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PrestamosComponent } from './components/prestamos/prestamos.component';
import { authGuard } from './auth.guard';
import { HistorialComponent } from './components/historial/historial.component';
import { DevolucionesComponent } from './components/devoluciones/devoluciones.component';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard]},
    { path: 'libros', component: LibrosComponent, canActivate: [authGuard]},
    { path: 'prestamos', component: PrestamosComponent,canActivate: [authGuard]}, 
    { path: 'historial', component: HistorialComponent, canActivate: [authGuard]},
    { path: 'devolucion', component: DevolucionesComponent, canActivate: [authGuard]},
    { path: '**', redirectTo: 'dashboard' }     
     
];
