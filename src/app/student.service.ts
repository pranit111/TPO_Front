import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Student } from './student';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

interface PaginatedResponse<T> {
  content: T[];
  pageable: any;
  last: boolean;
  totalPages: number;
  totalElements: number;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = environment.apiUrls.studentService;
  token = localStorage.getItem("authtoken");
  headers = new HttpHeaders({
    'Authorization': `${this.token}`
  });

  downloadExcel(filters?: {
    firstName?: string;
    department?: string;
    academicYear?: string;
    minAvgMarks?: number;
    maxAvgMarks?: number;
    yearOfPassing?: number;
  }): Observable<Blob> {
    let params = new HttpParams();
    
    if (filters?.firstName) {
      params = params.set('firstName', filters.firstName);
    }
    if (filters?.department) {
      params = params.set('department', filters.department);
    }
    if (filters?.academicYear) {
      params = params.set('academicYear', filters.academicYear);
    }
    if (filters?.minAvgMarks !== undefined) {
      params = params.set('minAvgMarks', filters.minAvgMarks.toString());
    }
    if (filters?.maxAvgMarks !== undefined) {
      params = params.set('maxAvgMarks', filters.maxAvgMarks.toString());
    }
    if (filters?.yearOfPassing !== undefined) {
      params = params.set('yearOfPassing', filters.yearOfPassing.toString());
    }

    return this.http.post(`${this.apiUrl}/Student/Search/Download`, null, {
      params,
      responseType: 'blob',
      headers: this.headers
    });
  }

  constructor(private http: HttpClient) {}
  
  // Create a new student
  createStudent(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/Student`,formData);
  }

  // Get all students
  getStudents(filters?: {
    firstName?: string;
    department?: string;
    academicYear?: string;
    minAvgMarks?: number;
    maxAvgMarks?: number;
    yearOfPassing?: number;
  }): Observable<PaginatedResponse<Student>> {
    let params = new HttpParams();

    if (filters?.firstName) {
      params = params.set('firstName', filters.firstName);
    }
    if (filters?.department) {
      params = params.set('department', filters.department);
    }
    if (filters?.academicYear) {
      params = params.set('academicYear', filters.academicYear);
    }
    if (filters?.minAvgMarks) {
      params = params.set('minAvgMarks', filters.minAvgMarks.toString());
    }
    if (filters?.maxAvgMarks) {
      params = params.set('maxAvgMarks', filters.maxAvgMarks.toString());
    }
    if (filters?.yearOfPassing) {
      params = params.set('yearOfPassing', filters.yearOfPassing.toString());
    }

    return this.http.get<PaginatedResponse<Student>>(`${this.apiUrl}/Student/Search`, { params });
  }

  getprofile(): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/Student/profile`)
  }
  // Update a student
  updateStudent(id: number, student: FormData): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/Student`, student);
  }

  // Delete a student
  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}