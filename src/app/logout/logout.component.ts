import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-logout',
  standalone: false,
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {
  private apiUrl = environment.apiUrls.authService + '/auth';

  constructor(private router: Router, private http: HttpClient) {}

  onLogout() {
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe({
      next: () => {
        localStorage.removeItem('username');
        this.router.navigate(['login']);
      },
      error: () => {
        // Even if the server call fails, clear local state and redirect
        localStorage.removeItem('username');
        this.router.navigate(['login']);
      }
    });
  }
}
