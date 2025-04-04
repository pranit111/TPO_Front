import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserRegService {
  constructor(private httpclient:HttpClient) {}
  private apiUrl = environment.apiUrls.authService + '/auth';

  getUsers(): Observable<User[]> {
    return this.httpclient.get<User[]>(`${this.apiUrl}/users`);
  }

  sendotp(user:User):Observable<any>{
    return this.httpclient.post(`${this.apiUrl}/register/user`,user,{responseType:'json'})
  }

  verify(email: string, otp: string): Observable<any> {
    const requestBody = { email: email, otp: otp };
    return this.httpclient.post(`${this.apiUrl}/verify/otp`, requestBody);
  }
}
