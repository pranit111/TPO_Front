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
constructor(private postlistng:PostListingService,private error:ErrorService,private router:Router){}
ngOnInit() {
  this.postlistng.getJobPosts().subscribe({
    next: (response: JobPost[]) => {
      this.jobPosts = response; // Store fetched job posts
      console.log(this.jobPosts); // Log to check if data is received correctly
    },
    error: (err) => {
      console.error('Error fetching job posts:', err);
    }
  });
}
  jobPosts: JobPost[] = [];

  navigateToJobDetails(jobId: number) {
    this.router.navigate(['/job_details', jobId]);  // Passing ID in URL
  }
}

