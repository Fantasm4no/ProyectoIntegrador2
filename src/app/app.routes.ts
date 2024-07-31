import { Routes } from '@angular/router';
import { LibrosComponent } from './components/libros/libros.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PrestamosComponent } from './components/prestamos/prestamos.component';
import { authGuard } from './auth.guard';
import { HistorialComponent } from './components/historial/historial.component';
import { DevolucionesComponent } from './components/devoluciones/devoluciones.component';
import ReservasComponent from './components/reserva/reserva.component';
import { InformacionComponent } from './components/informacion/informacion.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { AyudaComponent } from './components/ayuda/ayuda.component';
import { ReporteUsuariosComponent } from './components/reporte/reporte.component';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard]},
    { path: 'libros', component: LibrosComponent, canActivate: [authGuard]},
    { path: 'prestamos', component: PrestamosComponent,canActivate: [authGuard]}, 
    { path: 'historial', component: HistorialComponent, canActivate: [authGuard]},
    { path: 'devolucion', component: DevolucionesComponent, canActivate: [authGuard]},
    { path: 'reservas', component: ReservasComponent, canActivate: [authGuard]},
    { path: 'informacion', component: InformacionComponent, canActivate: [authGuard]},
    { path: 'aboutUs', component: AboutUsComponent, canActivate: [authGuard]},
    { path: 'ayuda', component: AyudaComponent, canActivate: [authGuard]},
    { path: 'reporte', component: ReporteUsuariosComponent, canActivate: [authGuard]},    
    { path: '**', redirectTo: 'dashboard' }     
     
];
