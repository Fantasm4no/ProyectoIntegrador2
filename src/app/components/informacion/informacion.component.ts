import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-informacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './informacion.component.html',
  styleUrl: './informacion.component.scss'
})
export class InformacionComponent {
  role: string | null = null;
  constructor(private authService: AuthService) { }
  
  ngOnInit(): void {
    this.role = this.authService.getRole();
  }
  logout() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('role');
    localStorage.removeItem("username");
    window.location.href = 'http://localhost:8080/biblioteca/LoginUsu.xhtml';
  }

}