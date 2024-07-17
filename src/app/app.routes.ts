import { Routes } from '@angular/router';
import { LibrosComponent } from './components/libros/libros.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
    { path: 'libros', component: LibrosComponent },
    { path: '**', redirectTo: '' }
];
