import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { JobPost } from './job-post';

@Injectable({
  providedIn: 'root'
})
export class PostListingService {


  private apiUrl = 'http://localhost:8080/api3/' 

  constructor(private http: HttpClient) {}

  // Fetch job posts
  getJobPosts(): Observable<JobPost[]> {
    return this.http.get<JobPost[]>(`${this.apiUrl}posts/student`).pipe(
      map((response) => response.map((job) => new JobPost(job)))
    );

}
getJobPost(id: number): Observable<JobPost> {
  return this.http.get<JobPost>(`${this.apiUrl}get/post`, {
    params: new HttpParams().set('post_id', id.toString())
  });
}

}