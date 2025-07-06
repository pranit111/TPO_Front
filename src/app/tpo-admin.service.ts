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
  
  // Enhanced Logs Service Methods
  getLogs(): Observable<Log[]> {
    return this.http.get<Log[]>(`${this.baseUrl}/api8`);
  }

  getLogsPaginated(page: number = 0, size: number = 20, sortBy: string = 'timestamp', sortDirection: string = 'desc'): Observable<any> {
    const params = { page: page.toString(), size: size.toString(), sortBy, sortDirection };
    return this.http.get<any>(`${this.baseUrl}/api8`, { params });
  }

  searchLogs(searchParams: any): Observable<any> {
    const params = this.buildSearchParams(searchParams);
    return this.http.get<any>(`${this.baseUrl}/api8/search`, { params });
  }

  filterLogsByAction(action: string, page: number = 0, size: number = 20): Observable<any> {
    const params = { action, page: page.toString(), size: size.toString() };
    return this.http.get<any>(`${this.baseUrl}/api8/filter/action`, { params });
  }

  filterLogsByEntity(entityName: string, page: number = 0, size: number = 20): Observable<any> {
    const params = { entityName, page: page.toString(), size: size.toString() };
    return this.http.get<any>(`${this.baseUrl}/api8/filter/entity`, { params });
  }

  filterLogsByUser(performedBy: string, page: number = 0, size: number = 20): Observable<any> {
    const params = { performedBy, page: page.toString(), size: size.toString() };
    return this.http.get<any>(`${this.baseUrl}/api8/filter/user`, { params });
  }

  filterLogsByDateRange(startDate: string, endDate: string, page: number = 0, size: number = 20): Observable<any> {
    const params = { startDate, endDate, page: page.toString(), size: size.toString() };
    return this.http.get<any>(`${this.baseUrl}/api8/filter/daterange`, { params });
  }

  getRecentLogs(hours: number = 24, page: number = 0, size: number = 20): Observable<any> {
    const params = { hours: hours.toString(), page: page.toString(), size: size.toString() };
    return this.http.get<any>(`${this.baseUrl}/api8/recent`, { params });
  }

  getLogsStatistics(days: number = 30): Observable<any> {
    const params = { days: days.toString() };
    return this.http.get<any>(`${this.baseUrl}/api8/stats`, { params });
  }

  exportLogsToExcel(filters: any = {}): Observable<Blob> {
    const params = this.buildSearchParams(filters);
    return this.http.get(`${this.baseUrl}/api8/export/excel`, { 
      params, 
      responseType: 'blob' 
    });
  }

  getLogById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api8/${id}`);
  }

  getUniqueActions(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api8/actions/unique`);
  }

  getUniqueEntities(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api8/entities/unique`);
  }

  getUniqueUsers(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api8/users/unique`);
  }

  saveLog(logData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api8/save`, logData);
  }

  private buildSearchParams(searchParams: any): any {
    const params: any = {};
    
    if (searchParams.action) params.action = searchParams.action;
    if (searchParams.performedBy) params.performedBy = searchParams.performedBy;
    if (searchParams.entityName) params.entityName = searchParams.entityName;
    if (searchParams.entityId) params.entityId = searchParams.entityId;
    if (searchParams.details) params.details = searchParams.details;
    if (searchParams.dateFrom) params.dateFrom = searchParams.dateFrom;
    if (searchParams.dateTo) params.dateTo = searchParams.dateTo;
    if (searchParams.page !== undefined) params.page = searchParams.page.toString();
    if (searchParams.size !== undefined) params.size = searchParams.size.toString();
    if (searchParams.sortBy) params.sortBy = searchParams.sortBy;
    if (searchParams.sortDirection) params.sortDirection = searchParams.sortDirection;
    
    return params;
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
  return this.http.get<DashboardData>(`${this.baseUrl}/api7/dashboard`);
}

getRealTimeStats(): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/api7/dashboard/stats/real-time`);
}

getGrowthAnalytics(months: number = 6): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/api7/dashboard/analytics/growth?months=${months}`);
}

getRecentActivities(limit: number = 10): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/api7/dashboard/activities/recent?limit=${limit}`);
}

getProcessMetrics(): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/api7/dashboard/metrics/process`);
}

getDepartmentAnalytics(): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/api7/dashboard/analytics/departments`);
}

getCompanyAnalytics(): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/api7/dashboard/analytics/companies`);
}

getPlacementTrends(months: number = 12): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/api7/dashboard/trends/placement?months=${months}`);
}

getPerformanceAnalytics(months: number = 12): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/api7/dashboard/analytics/performance?months=${months}`);
}

getPackageDistribution(): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/api7/dashboard/analytics/package-distribution`);
}

getHiringTrends(months: number = 12): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/api7/dashboard/analytics/hiring-trends?months=${months}`);
}

getSystemHealth(): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/api7/dashboard/system/health`);
}

getDataIntegrity(): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/api7/dashboard/validation/data-integrity`);
}

getDashboardNotifications(): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/api7/dashboard/notifications`);
}

// Export methods
exportDashboardData(format: string = 'excel'): Observable<Blob> {
  return this.http.get(`${this.baseUrl}/api7/dashboard/export/dashboard-data?format=${format}`, {
    responseType: 'blob'
  });
}

exportStudentData(format: string = 'excel', department: string = '', status: string = ''): Observable<Blob> {
  let params = `format=${format}`;
  if (department) params += `&department=${department}`;
  if (status) params += `&status=${status}`;
  
  return this.http.get(`${this.baseUrl}/api7/dashboard/export/students?${params}`, {
    responseType: 'blob'
  });
}

exportCompanyData(format: string = 'excel'): Observable<Blob> {
  return this.http.get(`${this.baseUrl}/api7/dashboard/export/companies?format=${format}`, {
    responseType: 'blob'
  });
}

refreshDashboardData(): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}/api7/dashboard/refresh`, {});
}

generateCustomReport(reportParams: any): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}/api7/dashboard/reports/custom`, reportParams);
}
getStudentProfile(id:number):Observable<any>{
  return this.http.get(`${this.baseUrl}/api1/tpo/Student/profile/${id}`);   } 

// Yearly Export and Analytics methods
exportYearlyBackup(year: number, format: string = 'excel'): Observable<Blob> {
  return this.http.get(`${this.baseUrl}/api7/dashboard/export/yearly-backup?year=${year}&format=${format}`, 
    { responseType: 'blob' });
}

getYearlyAnalytics(year: number): Observable<any> {
  return this.http.get(`${this.baseUrl}/api7/dashboard/analytics/yearly/${year}`);
}

getYearlyComparison(years: number = 3): Observable<any> {
  return this.http.get(`${this.baseUrl}/api7/dashboard/analytics/comparison?years=${years}`);
}

// Additional analytics methods
getCompanyDetails(): Observable<any> {
  return this.http.get(`${this.baseUrl}/api7/dashboard/analytics/company-details`);
}
}
