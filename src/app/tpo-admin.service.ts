import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { DashboardData } from './models/dashboard-data';
import { Observable } from 'rxjs';
interface Log {
  id: number;
  action: string;
  performedBy: string;
  timestamp: string;
  entityName: string;
  entityId: string;
  details: string;
}
@Injectable({
  providedIn: 'root'
})

export class TpoAdminService {

  addCompany(newCompany: {  name: string; industryType: string; email: string; contactNumber: string; location: string; website: string; associatedSince: null; active: boolean; }) {
    return this.http.post<any>(`${this.companyBaseUrl}`, newCompany);
  }
  
  getCompaniesData() {
    throw new Error('Method not implemented.');
  }
  baseUrl = environment.apiUrls.userService;
  companyBaseUrl= environment.apiUrls.companyService;
  constructor(private http:HttpClient) { }
  tpoBaseUrl=environment.apiUrls.tpoService;
  getLogs(): Observable<Log[]> {
    return this.http.get<Log[]>(`${this.baseUrl}/api8`);
  }
 getAllCompanies(){
  return this.http.get(this.companyBaseUrl);
 }
 updateCompany(id: number, company: any) {
  return this.http.put<any>(`${this.companyBaseUrl}/${id}`, company);
}

deleteCompany(id: number) {
  return this.http.delete(`${this.companyBaseUrl}/${id}`);
}

// Add TPO User related methods
getAllTpoUsers() {
  return this.http.get(`${this.tpoBaseUrl}/`);
}

addTpoUser(user: any, role: string) {
  return this.http.post(`${this.tpoBaseUrl}/register/TPO_USER?role=${encodeURIComponent(role)}`, user);
}


updateTpoUser(id: number, user: any,status:boolean) {
  return this.http.put(`${this.tpoBaseUrl}/${id}?status=${encodeURIComponent(status)}`, user);
}

deleteTpoUser(id: number) {
  return this.http.delete(`${this.tpoBaseUrl}/${id}`);
}

updateTpoUserStatus(id: number, status: boolean) {
  return this.http.patch(`http://localhost:8080/api/tpo-users/${id}/status`, { active: status });
}
getDashboardData(): Observable<DashboardData> {
  return this.http.get<DashboardData>('http://localhost:8080/api7/dashboard');
}
}
