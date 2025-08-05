import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface PlacementDTO {
  id: number;
  studentName: string;
  companyName: string;
  packageOffered: number;
  joiningDate: string;
  offerLetterUrl: string;
  department: string;
  position: string;
  applicationId: number;
}

@Injectable({
  providedIn: 'root'
})
export class PlacementServiceService {
  private baseUrl = environment.apiUrls.placementService + '/placements';

  constructor(private http: HttpClient) { }

  // Get all placements with pagination
  getAllPlacements(pageable: any): Observable<any> {
    let params = new HttpParams()
      .set('page', pageable.page || 0)
      .set('size', pageable.size || 10);
    
    return this.http.get<any>(`${this.baseUrl}`, { params });
  }

  // Get placement by ID
  getPlacementById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  // Search placements with filters
  searchPlacements(filters: any): Observable<any> {
    let params = new HttpParams()
      .set('q', filters.keyword || '')
      .set('page', filters.page || 0)
      .set('size', filters.size || 10);
    
    // Add optional parameters if they exist
    if (filters.companyName) {
      params = params.set('companyName', filters.companyName);
    }
    
    if (filters.studentYear) {
      params = params.set('studentYear', filters.studentYear);
    }
    
    if (filters.department) {
      params = params.set('department', filters.department);
    }
    
    if (filters.minPackage !== undefined) {
      params = params.set('minPackage', filters.minPackage);
    }
    
    if (filters.maxPackage !== undefined) {
      params = params.set('maxPackage', filters.maxPackage);
    }
    
    if (filters.fromDate) {
      params = params.set('fromDate', filters.fromDate);
    }
    
    if (filters.toDate) {
      params = params.set('toDate', filters.toDate);
    }

    return this.http.get<any>(`${this.baseUrl}/search`, { params });
  }

  // Download all placements as Excel file
  downloadAllPlacementsExcel(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/download/excel`, {
      responseType: 'blob'
    });
  }

  // Download filtered placements as Excel file
  downloadFilteredPlacementsExcel(filterType: string, filterValue: string): Observable<Blob> {
    const params = new HttpParams()
      .set('filterType', filterType)
      .set('filterValue', filterValue);

    return this.http.get(`${this.baseUrl}/download/excel/filtered`, {
      params,
      responseType: 'blob'
    });
  }

  // Download placements as Excel file (legacy method with search filters)
  downloadExcel(filters: any): Observable<Blob> {
    let params = new HttpParams();
    
    if (filters.keyword) {
      params = params.set('q', filters.keyword);
    }
    
    if (filters.companyName) {
      params = params.set('companyName', filters.companyName);
    }
    
    if (filters.department) {
      params = params.set('department', filters.department);
    }
    
    if (filters.studentYear) {
      params = params.set('studentYear', filters.studentYear);
    }
    
    if (filters.minPackage !== undefined) {
      params = params.set('minPackage', filters.minPackage);
    }
    
    if (filters.maxPackage !== undefined) {
      params = params.set('maxPackage', filters.maxPackage);
    }
    
    if (filters.fromDate) {
      params = params.set('fromDate', filters.fromDate);
    }
    
    if (filters.toDate) {
      params = params.set('toDate', filters.toDate);
    }

    return this.http.get(`${this.baseUrl}/search/download`, {
      params,
      responseType: 'blob'
    });
  }

  // Create a new placement record
  createPlacement(placement: any, applicationId: number, offerLetter: File): Observable<any> {
    const formData = new FormData();
    
    // Convert placement object to form data
    Object.keys(placement).forEach(key => {
      formData.append(key, placement[key]);
    });
    
    // Add application ID and offer letter
    formData.append('applicationid', applicationId.toString());
    formData.append('file', offerLetter);
    
    return this.http.post<any>(`${this.baseUrl}`, formData);
  }

  // Update an existing placement
  updatePlacement(id: number, placement: any, offerLetter?: File): Observable<any> {
    const formData = new FormData();
    
    // Convert placement object to form data
    Object.keys(placement).forEach(key => {
      if (placement[key] !== null && placement[key] !== undefined) {
        formData.append(key, placement[key]);
      }
    });
    
    // Add offer letter if provided
    if (offerLetter) {
      formData.append('file', offerLetter);
    }
    
    return this.http.put<any>(`${this.baseUrl}/${id}`, formData);
  }

  // Delete a placement record
  deletePlacement(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
  
  // Map the raw placement data to PlacementDTO
  mapToPlacementDTO(rawData: any): PlacementDTO {
    // Handle nested structure from API response
    if (rawData.application) {
      return {
        id: rawData.id,
        studentName: `${rawData.application.student.firstName} ${rawData.application.student.lastName}`,
        companyName: rawData.application.jobPost.company.name,
        packageOffered: rawData.pacedPackage || 0,
        joiningDate: rawData.placementDate,
        offerLetterUrl: rawData.offerLetterUrl,
        department: rawData.application.student.department,
        position: rawData.application.designation,
        applicationId: rawData.application.id
      };
    }
    
    // Return as is if already in DTO format
    return rawData as PlacementDTO;
  }

  // Filter placements by company name
  filterByCompany(companyName: string, page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('companyName', companyName)
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<any>(`${this.baseUrl}/filter/company`, { params });
  }

  // Filter placements by package range
  filterByPackageRange(minPackage: number, maxPackage: number, page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('minPackage', minPackage.toString())
      .set('maxPackage', maxPackage.toString())
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<any>(`${this.baseUrl}/filter/package-range`, { params });
  }

  // Filter placements by date range
  filterByDateRange(fromDate: string, toDate: string, page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('fromDate', fromDate)
      .set('toDate', toDate)
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<any>(`${this.baseUrl}/filter/date-range`, { params });
  }

  // Filter placements by student year
  filterByStudentYear(studentYear: string, page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('studentYear', studentYear)
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<any>(`${this.baseUrl}/filter/student-year`, { params });
  }

  // Filter placements by department
  filterByDepartment(department: string, page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('department', department)
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<any>(`${this.baseUrl}/filter/department`, { params });
  }
}