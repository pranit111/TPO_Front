import { Component, OnInit } from '@angular/core';
import { UserRegService } from '../user-reg.service';
import { User } from '../user';
import { ErrorService } from '../error.service';
import { Router, RouterModule, ROUTES } from '@angular/router';
import { AppRoutingModule } from '../app-routing.module';

@Component({
  selector: 'app-user-reg',
  standalone: false,
  templateUrl: './user-reg.component.html',
  styleUrl: './user-reg.component.css'
})
export class UserRegComponent implements OnInit {
  constructor(private useregservice:UserRegService,private error:ErrorService,private router:Router){}
  
  step=1;
  user = { username: '', email: '', password: '', confirmPassword: '',role:'' };
  users: User[] = []; // Array to store users
  otp:string="";
  
  ngOnInit() {
  console.log("User Registration Page");
  }

  isSendingOtp: boolean = false;

  
  next() {
    this.step=2
    }
    prev() {
     this.step=1
      }
      getotp() {
        if (!this.user.username || !this.user.password || !this.user.email) {
          this.error.setError('Username and Email is required!')
          return; 
        }
        // Check if passwords match
        if (this.user.password && this.user.confirmPassword && this.user.password !== this.user.confirmPassword) {
          this.error.setError("Passwords Don't Match");
          return; // Stop execution
        }
      
        this.user.role = "STUDENT"; // Assign role
        this.isSendingOtp = true;
        this.useregservice.sendotp(this.user).subscribe({
          next: (response: any) => {
            console.log("OTP Response:", response); // Debugging
      
            if (response.message) { 
              this.error.setError(response.message,"bg-green-600"); // Show success message if API returns it
              this.next();  // Navigate to OTP entry
            }
          },
          error: (err) => {
            console.error("Error sending OTP:", err);
            this.isSendingOtp = false
            // Display API error message
            if (err.error?.error) {
              this.error.setError(err.error.error); // Shows "User already exists and is verified!"
            } else {
              this.error.setError("An error occurred while sending OTP.");
            }
          }
        });
      }
      
      verifyotp(){
        this.useregservice.verify(this.user.email,this.otp).subscribe({
          next: (response: any) => {
            console.log("Full Response from API:", response); // Debugging step
            if(response.message && response.message.includes("User Verified")){
              this.router.navigate(['/login'])
              this.error.setError("User Verified","bg-green-600")
            }
            if(response.error){
              this.error.setError(response.error)
            }
          }
        })
      }
}
