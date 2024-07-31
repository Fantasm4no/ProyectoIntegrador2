import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-ayuda',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ayuda.component.html',
  styleUrl: './ayuda.component.scss'
})
export class AyudaComponent {
  role: string | null = null;
  constructor(private authService: AuthService) { }
  
  ngOnInit(): void {
    this.role = this.authService.getRole();
  }
  logout() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('role');
    localStorage.removeItem("username");
    window.location.href = 'http://192.168.177.138:8080/biblioteca(1)/LoginUsu.xhtml';
  }

}