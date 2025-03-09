import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserRegService {

  constructor(private httpclient:HttpClient) {}
  private apiUrl='http://localhost:8080/api0/auth'
  sendotp(user:User):Observable<any>{
        
return this.httpclient.post(`${this.apiUrl}/register/user`,user,{responseType:'json'})
  }
  verify(email: string, otp: string): Observable<any> {
    const requestBody = { email: email, otp: otp }; // Create JSON object
  
    return this.httpclient.post(`${this.apiUrl}/verify/otp`, requestBody);
  }
}
