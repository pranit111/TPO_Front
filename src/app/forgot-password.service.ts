import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {

  apiurl='http://localhost:8080/api0/auth';

  sendotp(email:string):Observable<any> {
    
   return this.http.post(`${this.apiurl}/forgot/password`,{'email':email}, { headers: { 'Content-Type': 'application/json' } })
  }
  changepass(email: string, otp: string, newpassword: string) {
    return this.http.post(`${this.apiurl}/change/password`, 
      { email, otp, newpassword },
      { headers: { 'Content-Type': 'application/json' } }
    );
  }
  

  constructor(private http:HttpClient) { }
}
