import { Component } from '@angular/core';
import { PostListingService } from '../post-listing.service';
import { ErrorService } from '../error.service';
import { JobPost } from '../job-post';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-post-listing',
  standalone: false,
  templateUrl: './post-listing.component.html',
  styleUrl: './post-listing.component.css'
})
export class PostListingComponent {
  jobPosts: JobPost[] = [];
  loading: boolean = true; // Add loading state variable

  constructor(private postlistng: PostListingService, private error: ErrorService, private router: Router) {}
  
  ngOnInit() {
    this.loading = true; // Set loading to true when starting data fetch
    this.postlistng.getJobPosts().subscribe({
      next: (response: JobPost[]) => {
        this.jobPosts = response; // Store fetched job posts
        console.log(this.jobPosts); // Log to check if data is received correctly
        this.loading = false; // Set loading to false when data is received
      },
      error: (err) => {
        console.error('Error fetching job posts:', err);
        this.error.setError('Failed to load job posts. Please try again later.');
        this.loading = false; // Set loading to false even on error
      }
    });
  }

  navigateToJobDetails(jobId: number) {
    this.router.navigate(['/job_details', jobId]);  // Passing ID in URL
  }
  
  // Add a method to check if there's no data and loading is complete
  get noJobPostsAvailable(): boolean {
    return this.jobPosts.length === 0 && !this.loading;
  }
}

