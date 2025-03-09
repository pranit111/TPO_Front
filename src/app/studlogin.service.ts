import { Injectable } from '@angular/core';
import { User } from './user';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class StudloginService {
  constructor(private http:HttpClient ){}
  private apiUrl='http://localhost:8080/api0/auth'
  login(user: User):Observable<any>{
    return  this.http.post(`${this.apiUrl}/stud/login`,user)
    
  }
logout(){
  localStorage.removeItem("authtoken")
}
  
 
}
