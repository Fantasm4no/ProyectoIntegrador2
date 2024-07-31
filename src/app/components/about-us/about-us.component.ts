import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent {

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
