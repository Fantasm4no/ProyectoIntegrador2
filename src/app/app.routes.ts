import { Routes } from '@angular/router';
import { LibrosComponent } from './components/libros/libros.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PrestamosComponent } from './components/prestamos/prestamos.component';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'libros', component: LibrosComponent },
    { path: 'prestamos', component: PrestamosComponent }
];
