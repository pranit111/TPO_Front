import { Component } from '@angular/core';
import { ErrorService } from '../error.service';
import { StudloginService } from '../studlogin.service';
import { User } from '../user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tpo-login',
  standalone: false,
  templateUrl: './tpo-login.component.html',
  styleUrl: './tpo-login.component.css'
})
export class TpoLoginComponent {
  constructor(private errorservice:ErrorService,private tpologin:StudloginService,private router:Router){}
  user:User =new User
  onlogin() {
    this.user.role = 'TPO';
  
    this.tpologin.tpo_login(this.user).subscribe({
      next: (response: any) => {
        console.log("Full Response from API:", response); // Debugging step
        
        // Check if response is valid
        if (response && typeof response === 'object') {
          // Cookie-based auth: token is set via HttpOnly cookie by the server
          
          // Handle different roles
          if (response.role === "ADMIN") {
            console.log("Admin login successful");
            this.router.navigate(['/tpo_admin']);
          } 
          else if (response.role === "TPO_USER") {
            console.log("TPO login successful");
            this.router.navigate(['/tpo/search']);
          }
          else if (response.role === "STUDENT") {
            console.error("Student tried to login as TPO");
            this.errorservice.setError("Students cannot login as TPO");
          }
          else {
            console.error("Unknown role:", response.role);
            this.errorservice.setError("Invalid user role for TPO login");
          }
        } 
        else {
          console.error("Unexpected response structure:", response);
          this.errorservice.setError("Unexpected response from server");
        }
      },
      error: (error: any) => {
        console.error("Login failed:", error);
        this.handleLoginError(error);
      }
    });
  }
  
  
  private handleLoginError(error: any) {
    if (error.status === 401) {
      this.errorservice.setError("Invalid credentials. Please try again.");
      this.router.navigate(['/tpo_login']);
    } else if (error.status === 500) {
      this.errorservice.setError("Invalid credentials.");
    } else if (error.status === 502) {
      this.errorservice.setError("Server error. Please try again later.");
    } else {
      this.errorservice.setError("An unexpected error occurred.");
    }
  }
  
}
