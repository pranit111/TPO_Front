import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../environments/environment';

interface PaginatedResponse<T> {
  results: any[];
  content: T[];
  pageable: any;
  last: boolean;
  totalPages: number;
  totalElements: number;
}

interface Application {
  id: number;
  applicationDate: string;
  designation: string;
  feedback: string | null;
  interviewDate: string | null;
  jobPost: {
    id: number;
    company: {
      id: number;
      name: string;
      industry: string;
    };
  };
  status: string;
  student: {
    id: number;
    user: {
      id: number;
      username: string;
      email: string;
    };
    academicYear: string;
    address: string;
    avgMarks: number;
    dateOfBirth: string;
    department: string;
    diplomaMarks: number;
    firstName: string;
    gender: string;
    gr_No: string | null;
    hscMarks: number;
    lastName: string;
    middleName: string;
    noOfBacklogs: number;
    phoneNumber: string;
    profileImageBase64: string | null;
    sem1Marks: number;
    sem2Marks: number;
    sem3Marks: number;
    sem4Marks: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationserviceService {
  updateToPlaced(applicationId: number | null, formData: FormData): Observable<any> {
      return this.http.post(`${this.baseUrl}/api9/placements?applicationid=${applicationId}`, formData);
    }
    
  updateApplication(selectedApplication: { id: number; status: string; feedback: string; interviewDate: string; }) {
    return this.http.put(`${this.apiUrl}/Application?application_id=${selectedApplication.id}`, {
      status: selectedApplication.status,
      feedback: selectedApplication.feedback,
      interviewDate: selectedApplication.interviewDate
    });
  }
  private baseUrl = environment.apiUrls.userService;
  private apiUrl = environment.apiUrls.applicationService;

  constructor(private router: Router, private http: HttpClient) {}

  getapplications(): Observable<PaginatedResponse<Application>> {
    return this.http.get<Application[]>(`${this.apiUrl}/Applications`).pipe(
      map((response: Application[]) => {
        // Transform the response to fit the PaginatedResponse structure
        return {
          results: response, // Map the response array to the results field
          content: response, // Optionally map to content if needed
          pageable: null,    // Set other fields as null or default values
          last: true,
          totalPages: 1,
          totalElements: response.length
        } as PaginatedResponse<Application>;
      })
    );
  }

  getapplicationssearch(filters: {
    studentName?: string;
    status?: string;
    company?: string;
    department?: string;
    position?: string;
    jobtype?: string;
    minSalary?: number;
    maxSalary?: number;
    fromDate?: string;
    toDate?: string;
  }): Observable<PaginatedResponse<Application>> {
    let params = new HttpParams();
  
    if (filters.studentName) {
      params = params.set('searchTerm', filters.studentName);
    }
    if (filters.status) {
      params = params.set('status', filters.status);
    }
    if (filters.company) {
      params = params.set('company', filters.company);
    }
    if (filters.department) {
      params = params.set('department', filters.department);
    }
    if (filters.position) {
      params = params.set('position', filters.position);
    }
    if (filters.jobtype) {
      params = params.set('jobtype', filters.jobtype);
    }
    if (filters.minSalary) {
      params = params.set('minSalary', filters.minSalary.toString());
    }
    if (filters.maxSalary) {
      params = params.set('maxSalary', filters.maxSalary.toString());
    }
    if (filters.fromDate) {
      params = params.set('fromDate', new Date(filters.fromDate).toISOString().split('T')[0]);
    }
    if (filters.toDate) {
      params = params.set('toDate', new Date(filters.toDate).toISOString().split('T')[0]);
    }
  
    return this.http.get<PaginatedResponse<Application>>(`${this.apiUrl}/Application/Search`, { params });
  }

  downloadExcel(filters: {
    studentName?: string;
    status?: string;
    company?: string;
    department?: string;
    position?: string;
    jobtype?: string;
    minSalary?: number;
    maxSalary?: number;
    fromDate?: string;
    toDate?: string;
  }): Observable<Blob> {
    let params = new HttpParams();
  
    if (filters.studentName) {
      params = params.set('searchTerm', filters.studentName);
    }
    if (filters.status) {
      params = params.set('status', filters.status);
    }
    if (filters.company) {
      params = params.set('company', filters.company);
    }
    if (filters.department) {
      params = params.set('department', filters.department);
    }
    if (filters.position) {
      params = params.set('position', filters.position);
    }
    if (filters.jobtype) {
      params = params.set('jobtype', filters.jobtype);
    }
    if (filters.minSalary) {
      params = params.set('minSalary', filters.minSalary.toString());
    }
    if (filters.maxSalary) {
      params = params.set('maxSalary', filters.maxSalary.toString());
    }
    if (filters.fromDate) {
      params = params.set('fromDate', new Date(filters.fromDate).toISOString().split('T')[0]);
    }
    if (filters.toDate) {
      params = params.set('toDate', new Date(filters.toDate).toISOString().split('T')[0]);
    }

    return this.http.post(`${this.apiUrl}/Application/Search/Download`, {}, {
      params,
      responseType: 'blob'
    });
  }

  postApplication(postid: number): Observable<any> {
    const params = new HttpParams().set('postid', postid.toString());
    return this.http.post(`${this.apiUrl}Application`, {}, { params });
  }

  updateApplicationStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}Application/${id}/status`, { status });
  }
}
