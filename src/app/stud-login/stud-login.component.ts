import { Component } from '@angular/core';
import { User } from '../user';
import { StudloginService } from '../studlogin.service';
import { ErrorService } from '../error.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stud-login',
  standalone: false,
  templateUrl: './stud-login.component.html',
  styleUrl: './stud-login.component.css'
})
export class StudLoginComponent {
  constructor(private studlogin: StudloginService,private error:ErrorService,private router:Router ){}
  user:User =new User
  ngOnInit(){
    const token=localStorage.getItem('authtoken')
    if(token){
      this.error.setError("User is logged in logout first","bg-blue-600")
      this.router.navigate(['/logout'])
    }

  }
  onlogin() {
    this.user.role = 'STUDENT';
    if ( !this.user.password || !this.user.email) {
      this.error.setError('Email and Password is required!')
      return; 
    }
    this.studlogin.login(this.user).subscribe({
      
      next: (response: any) => {
        console.log("Full Response from API:", response); // Debugging step

        if (response.status === 'success') {
          const token = response.token; // Extract token
          localStorage.setItem('authtoken', token); // Store token
          this.error.setError("Login Successful","bg-green-600")
          this.router.navigate(['/profile'])
          // Redirect or perform other actions
        } else {
          this.error.setError(response.message || "Unexpected error.");
        }
      },
      error: (error: any) => {
        console.error("Login failed:", error);
        this.handleLoginError(error);
      }
    });}
  
  
  private handleLoginError(error: any) {
    if (error.status === 401) {
      this.error.setError("Invalid credentials. Please try again.");
    } else if (error.status === 500) {
      this.error.setError("Invalid credentials.");
    } else if (error.status === 502) {
      this.error.setError("Server error. Please try again later.");
    } else {
      this.error.setError("An unexpected error occurred.");
    }
  }
  

}
