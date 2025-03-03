import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class TpoLoginService {

    constructor(private http:HttpClient ){}
    private apiUrl='http://localhost:8080'
    login(user: User):Observable<any>{
      return  this.http.post(`${this.apiUrl}/tpo/login`,user,{ responseType:'json'})
      
    }
}
