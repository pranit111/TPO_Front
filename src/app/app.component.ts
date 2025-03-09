import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TPO_FRONT2';
  constructor(private authService: AuthService, private router: Router) {}

  // ngOnInit() {
  //   if (this.authService.isAuthenticated()) {
  //     this.router.navigate(['/stud_profile']);  // Redirect to profile if authenticated
  //   } else {
  //     this.router.navigate(['/stud_login']);  // Redirect to login if not authenticated
  //   }
  // }
}
