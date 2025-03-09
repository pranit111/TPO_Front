import { Component } from '@angular/core';
import { ForgotPasswordService } from '../forgot-password.service';
import { ErrorService } from '../error.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  constructor(private f_p_service:ForgotPasswordService,private error:ErrorService,private router:Router){}

getotp() {

  
  // Check if passwords match
 
this.f_p_service.sendotp(this.email).subscribe({
  next: (response: any) => {
    console.log("OTP Response:", response); // Debugging

    if (response.message) { 
      this.error.setError(response.message); // Show success message if API returns it
      this.next();  // Navigate to OTP entry
    }
  },
  error: (err) => {
    console.error("Error sending OTP:", err);

    // Display API error message
    if (err.error?.error) {
      this.error.setError(err.error.error); // Shows "User already exists and is verified!"
    } else {
      this.error.setError("An error occurred while sending OTP.");
    }
  }
})
}
changepass(){
  if (this.password && this.confirmPassword && this.password !== this.confirmPassword) {
    this.error.setError("Passwords Don't Match");
    return;
  }
  this.f_p_service.changepass(this.email,this.otp,this.password).subscribe({
    next: (response: any) => {
      // Debugging
  
      if (response.message) { 
        this.error.setError(response.message,"bg-green-600");
        this.router.navigate([""]) // Show success message if API returns it
         // Navigate to OTP entry
      }
    },
    error: (err) => {
      
  
      // Display API error message
      if (err.error?.error) {
        this.error.setError(err.error.error); // Shows "User already exists and is verified!"
      } else {
        this.error.setError("An error occurred while updating password.");
      }
    }
  })

}


allowotp=false
  step=1
  otp=''
  email=''
  password=''
  confirmPassword=''

  next() {
    this.step=2
    }
    prev() {
     this.step=1
      }


}
