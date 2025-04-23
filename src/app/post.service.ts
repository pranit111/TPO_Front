import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

interface JobData {
  companyName: string;
  jobDesignation: string;
  location: string;
  jobType: string;
  description: string;
  packageAmount: string;
  status: string;
  minSsc: string;
  minHsc: string;
  minPercentage: number;
  backlogAllowance: number;
  preferredCourse: string;
  skillsRequirements: string;
  selectionRounds: string;
  modeOfRecruitment: string;
  testPlatform: string;
  recruitmentDetails: string;
  aptitude: boolean;
  applicationStartDate: Date;
  applicationEndDate: Date;
  selectionStartDate: Date;
  selectionEndDate: Date;
}

interface PaginatedResponse<T> {
  content: T[];
  pageable: any;
  last: boolean;
  totalPages: number;
  totalElements: number;
}

interface Company {
  id: number;
  name: string;
  industryType: string;
  email: string;
  contactNumber: string;
  location: string | null;
  website: string | null;
  associatedSince: string | null;
  tpoCoordinator: string | null;
  active: boolean | null;
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = environment.apiUrls.postService;
  private apiUrl2 = environment.apiUrls.applicationService;

  constructor(private http: HttpClient) { }

  createPost(jobData: JobData): Observable<any> {
    return this.http.post(`${this.apiUrl}/Post`, jobData);
  }

  getCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.apiUrl2}/companies`);
  }

  searchPosts(filters: {
    status?: string;
    company?: string;
    position?: string;
    jobType?: string;
    minSalary?: number;
    maxSalary?: number;
    page?: number;
    size?: number;
  }): Observable<PaginatedResponse<any>> {
    let params = new HttpParams()
      .set('page', filters.page?.toString() || '0')
      .set('size', filters.size?.toString() || '10');

    if (filters.status) {
      params = params.set('status', filters.status);
    }
    if (filters.company) {
      params = params.set('company', filters.company);
    }
    if (filters.position) {
      params = params.set('position', filters.position);
    }
    if (filters.jobType) {
      params = params.set('jobType', filters.jobType);
    }
    if (filters.minSalary) {
      params = params.set('minSalary', filters.minSalary.toString());
    }
    if (filters.maxSalary) {
      params = params.set('maxSalary', filters.maxSalary.toString());
    }

    return this.http.get<PaginatedResponse<any>>(`${this.apiUrl}/Post/Search`, { params });
  }

  downloadExcel(filters: {
    status?: string;
    company?: string;
    position?: string;
    jobType?: string;
    minSalary?: number;
    maxSalary?: number;
  }): Observable<Blob> {
    let params = new HttpParams();

    if (filters.status) {
      params = params.set('status', filters.status);
    }
    if (filters.company) {
      params = params.set('company', filters.company);
    }
    if (filters.position) {
      params = params.set('position', filters.position);
    }
    if (filters.jobType) {
      params = params.set('jobType', filters.jobType);
    }
    if (filters.minSalary) {
      params = params.set('minSalary', filters.minSalary.toString());
    }
    if (filters.maxSalary) {
      params = params.set('maxSalary', filters.maxSalary.toString());
    }

    return this.http.post(`${this.apiUrl}/Post/Search/Download`, {}, {
      params,
      responseType: 'blob'
    });
  }
  updatePost(postData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/Post?post_id=${postData.id}`, postData);
  }

  // Optionally: Get Post by ID (if needed)
  getPostById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/Post/tpo?post_id=${id}`);
  }

} 