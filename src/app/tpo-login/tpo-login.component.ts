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
  
    this.tpologin.login(this.user).subscribe({
      next: (response: any) => {
        console.log("Full Response from API:", response); // Debugging step
        console.log(response.role)
        // Ensure response is an object before accessing properties
        if (response && typeof response === 'object' && 'token' in response && response.role!="STUDENT") {
          const token = response.token; // Extract token
  
          localStorage.setItem('authtoken', token); // Store token
          console.log("Login successful, Token:", token);
          this.router.navigate(['/tpo/search']);
          // Perform redirection or other actions
        } 
        else if(response.role="STUDENT"){
          console.error("Unexpected response structure:", response);
          
          this.errorservice.setError("Student Can't Login as TPO");

        }
        else {
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
