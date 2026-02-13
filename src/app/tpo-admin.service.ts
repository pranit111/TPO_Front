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
  dashboardBaseUrl = environment.apiUrls.dashboardService;
  logsBaseUrl = environment.apiUrls.logsService;
  
  companyBaseUrl= environment.apiUrls.companyService;
  constructor(private http:HttpClient) { }
  tpoBaseUrl=environment.apiUrls.tpoService;
  getLogs(page: number = 0, size: number = 20): Observable<any> {
    return this.http.get<any>(`${this.logsBaseUrl}/?page=${page}&size=${size}`);
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


getDashboardData(): Observable<DashboardData> {
  return this.http.get<DashboardData>(`${this.dashboardBaseUrl}/dashboard`);
}

getRealTimeStats(): Observable<any> {
  return this.http.get<any>(`${this.dashboardBaseUrl}/dashboard/stats/real-time`);
}

getGrowthAnalytics(months: number = 6): Observable<any> {
  return this.http.get<any>(`${this.dashboardBaseUrl}/dashboard/analytics/growth?months=${months}`);
}

getRecentActivities(limit: number = 10): Observable<any> {
  return this.http.get<any>(`${this.dashboardBaseUrl}/dashboard/activities/recent?limit=${limit}`);
}

getProcessMetrics(): Observable<any> {
  return this.http.get<any>(`${this.dashboardBaseUrl}/dashboard/metrics/process`);
}

getDepartmentAnalytics(): Observable<any> {
  return this.http.get<any>(`${this.dashboardBaseUrl}/dashboard/analytics/departments`);
}

getCompanyAnalytics(): Observable<any> {
  return this.http.get<any>(`${this.dashboardBaseUrl}/dashboard/analytics/companies`);
}

getPlacementTrends(months: number = 12): Observable<any> {
  return this.http.get<any>(`${this.dashboardBaseUrl}/dashboard/trends/placement?months=${months}`);
}

getPerformanceAnalytics(months: number = 12): Observable<any> {
  return this.http.get<any>(`${this.dashboardBaseUrl}/dashboard/analytics/performance?months=${months}`);
}

getPackageDistribution(): Observable<any> {
  return this.http.get<any>(`${this.dashboardBaseUrl}/dashboard/analytics/package-distribution`);
}

getHiringTrends(months: number = 12): Observable<any> {
  return this.http.get<any>(`${this.dashboardBaseUrl}/dashboard/analytics/hiring-trends?months=${months}`);
}

getSystemHealth(): Observable<any> {
  return this.http.get<any>(`${this.dashboardBaseUrl}/dashboard/system/health`);
}

getDataIntegrity(): Observable<any> {
  return this.http.get<any>(`${this.dashboardBaseUrl}/dashboard/validation/data-integrity`);
}

getDashboardNotifications(): Observable<any> {
  return this.http.get<any>(`${this.dashboardBaseUrl}/dashboard/notifications`);
}

// Export methods
exportDashboardData(format: string = 'excel'): Observable<Blob> {
  return this.http.get(`${this.dashboardBaseUrl}/dashboard/export/dashboard-data?format=${format}`, {
    responseType: 'blob'
  });
}

exportStudentData(format: string = 'excel', department: string = '', status: string = ''): Observable<Blob> {
  let params = `format=${format}`;
  if (department) params += `&department=${department}`;
  if (status) params += `&status=${status}`;
  
  return this.http.get(`${this.dashboardBaseUrl}/dashboard/export/students?${params}`, {
    responseType: 'blob'
  });
}

exportCompanyData(format: string = 'excel'): Observable<Blob> {
  return this.http.get(`${this.dashboardBaseUrl}/dashboard/export/companies?format=${format}`, {
    responseType: 'blob'
  });
}

refreshDashboardData(): Observable<any> {
  return this.http.post<any>(`${this.dashboardBaseUrl}/dashboard/refresh`, {});
}

generateCustomReport(reportParams: any): Observable<any> {
  return this.http.post<any>(`${this.dashboardBaseUrl}/dashboard/reports/custom`, reportParams);
}
getStudentProfile(id:number):Observable<any>{
  return this.http.get(`${this.baseUrl}/api1/tpo/Student/profile/${id}`);   } 

// Yearly Export and Analytics methods
exportYearlyBackup(year: number, format: string = 'excel'): Observable<Blob> {
  return this.http.get(`${this.dashboardBaseUrl}/dashboard/export/yearly-backup?year=${year}&format=${format}`, 
    { responseType: 'blob' });
}

getYearlyAnalytics(year: number): Observable<any> {
  return this.http.get(`${this.dashboardBaseUrl}/dashboard/analytics/yearly/${year}`);
}

getYearlyComparison(years: number = 3): Observable<any> {
  return this.http.get(`${this.dashboardBaseUrl}/dashboard/analytics/comparison?years=${years}`);
}

// Additional analytics methods
getCompanyDetails(): Observable<any> {
  return this.http.get(`${this.dashboardBaseUrl}/dashboard/analytics/company-details`);
}
}
