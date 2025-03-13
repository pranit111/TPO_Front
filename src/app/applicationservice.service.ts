import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplicationserviceService {
 
  private apiUrl = 'http://localhost:8080/api4/';  

  constructor(private router: Router, private http: HttpClient) {}
  getapplications(): Observable<any> {
    return this.http.get(`${this.apiUrl}Applications`);
  }

  postApplication(postid: number): Observable<any> {
    const params = new HttpParams().set('postid', postid.toString()); // Convert number to string for query params
    return this.http.post(`${this.apiUrl}Application`, {}, { params });
  }
}
