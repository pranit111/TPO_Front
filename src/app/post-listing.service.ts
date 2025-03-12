import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { JobPost } from './job-post';

@Injectable({
  providedIn: 'root'
})
export class PostListingService {
  private apiUrl = 'http://localhost:8080/api3/posts/student'; // Replace with actual API URL

  constructor(private http: HttpClient) {}

  // Fetch job posts
  getJobPosts(): Observable<JobPost[]> {
    return this.http.get<JobPost[]>(this.apiUrl).pipe(
      map((response) => response.map((job) => new JobPost(job)))
    );

}
}