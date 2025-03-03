import { Component } from '@angular/core';
import { ErrorService } from '../error.service';
import { StudloginService } from '../studlogin.service';
import { User } from '../user';

@Component({
  selector: 'app-tpo-login',
  standalone: false,
  templateUrl: './tpo-login.component.html',
  styleUrl: './tpo-login.component.css'
})
export class TpoLoginComponent {
  constructor(private errorservice:ErrorService,private tpologin:StudloginService ){}
  user:User =new User
  onlogin() {
    this.user.role = 'TPO';
  
    this.tpologin.login(this.user).subscribe({
      next: (response: any) => {
        console.log("Full Response from API:", response); // Debugging step
  
        // Ensure response is an object before accessing properties
        if (response && typeof response === 'object' && 'token' in response) {
          const token = response.token; // Extract token
  
          localStorage.setItem('authtoken', token); // Store token
          console.log("Login successful, Token:", token);
          
          // Perform redirection or other actions
        } else {
          console.error("Unexpected response structure:", response);
          this.errorservice.setError("Unexpected response from server.");
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
    } else if (error.status === 500) {
      this.errorservice.setError("Invalid credentials.");
    } else if (error.status === 502) {
      this.errorservice.setError("Server error. Please try again later.");
    } else {
      this.errorservice.setError("An unexpected error occurred.");
    }
  }
  
}
