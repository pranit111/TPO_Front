import { Component } from '@angular/core';
import { PostListingService } from '../post-listing.service';
import { ErrorService } from '../error.service';
import { JobPost } from '../job-post';

@Component({
  selector: 'app-post-listing',
  standalone: false,
  templateUrl: './post-listing.component.html',
  styleUrl: './post-listing.component.css'
})
export class PostListingComponent {
constructor(private postlistng:PostListingService,private error:ErrorService){}
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

}
