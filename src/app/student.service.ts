import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Student } from './student';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = 'http://localhost:8080/api1/Student'; // Update with your backend API URL
   token = localStorage.getItem("authtoken");
   headers = new HttpHeaders({
    'Authorization': `${this.token}`
  });
  constructor(private http: HttpClient) {}

  // Create a new student
  createStudent(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  // Get all students
  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl);
  }

  // Get a student by ID
  getStudentById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${id}`);
  }
  getprofile(): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/profile`)
  }
  // Update a student
  updateStudent(id: number, student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/${id}`, student);
  }

  // Delete a student
  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}