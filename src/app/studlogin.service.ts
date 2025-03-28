import { Injectable } from '@angular/core';
import { User } from './user';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudloginService {
  constructor(private http:HttpClient ){}
  private apiUrl = environment.apiUrls.authService + '/auth';

  login(user: User):Observable<any>{
    return this.http.post(`${this.apiUrl}/stud/login`,user)
  }
logout(){
  localStorage.removeItem("authtoken")
}
  
 
}
