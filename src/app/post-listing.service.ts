import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { JobPost } from './job-post';
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class PostListingService {


  private apiUrl = environment.apiUrls.postService;

  constructor(private http: HttpClient) {}

  // Fetch job posts
  getJobPosts(): Observable<JobPost[]> {
    return this.http.get<JobPost[]>(`${this.apiUrl}/posts/student`).pipe(
      map((response) => response.map((job) => new JobPost(job)))
    );

}
getJobPost(id: number): Observable<JobPost> {
  return this.http.get<JobPost>(`${this.apiUrl}/get/post`, {
    params: new HttpParams().set('post_id', id.toString())
  });
}

}