import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
  @Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {

  apiurl=environment.apiUrls.userService+'/auth';
  apiurl2=environment.apiUrls.userService;
  sendotp(email:string):Observable<any> {
    
   return this.http.post(`${this.apiurl2}/api0/auth/forgot/password`,{'email':email}, { headers: { 'Content-Type': 'application/json' } })
  }
  changepass(email: string, otp: string, newpassword: string) {
    return this.http.post(`${this.apiurl2}/api0/auth/change/password`, 
      { email, otp, newpassword },
      { headers: { 'Content-Type': 'application/json' } }
    );
  }
  

  constructor(private http:HttpClient) { }
}
