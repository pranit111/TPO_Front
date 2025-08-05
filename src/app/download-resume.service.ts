import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DownloadResumeService {
  // Base URLs
  placementBaseUrl = environment.apiUrls.placementService;
  studentBaseUrl = environment.apiUrls.studentService;
  
  constructor(private http: HttpClient) { }
  
  getOfferLetterPdf(id: number) {
    return this.http.get(`${this.placementBaseUrl}/placements/offerletter/${id}`, {
      responseType: 'blob',
    });
  }
  
  getResultPdf(id: number, course: string) {
    return this.http.get(`${this.studentBaseUrl}/pdf/results/${id}/${course}`, {
      responseType: 'blob',
    });
  }

  getResumePdf(studentId: number): Observable<Blob> {
    return this.http.get(`${this.studentBaseUrl}/pdf/${studentId}`, {
      responseType: 'blob',
    });
  }
}
