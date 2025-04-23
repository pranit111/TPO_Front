import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DownloadResumeService {
  getResultPdf(id: number, course: string) {
    return this.http.get(`${this.baseUrl}/pdf/results/${id}/${course}`, {
      responseType: 'blob',
    });
  }


  constructor( private http:HttpClient) { }
  // resume.service.ts
  baseUrl = environment.apiUrls.studentService;
getResumePdf(studentId: number): Observable<Blob> {
  return this.http.get(`${this.baseUrl}/pdf/${studentId}`, {
    responseType: 'blob',
  });
}

}
