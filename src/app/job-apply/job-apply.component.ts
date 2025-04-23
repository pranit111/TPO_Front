import { Component } from '@angular/core';
import { ErrorService } from '../error.service';
import { PostListingService } from '../post-listing.service';
import { ActivatedRoute, Router } from '@angular/router';
import { JobPost } from '../job-post';
import { StudProfileComponent } from '../stud-profile/stud-profile.component';
import { Student } from '../student';
import { StudentService } from '../student.service';
import { ApplicationserviceService } from '../applicationservice.service';


@Component({
  selector: 'app-job-apply',
  standalone: false,
  templateUrl: './job-apply.component.html',
  styleUrl: './job-apply.component.css'
})
export class JobApplyComponent {
nextstep() {
this.step=2

this.getstud()
}
 
constructor(private router:Router,private error:ErrorService,private postlisting:PostListingService,private route: ActivatedRoute,private studentservice:StudentService,private applicationService:ApplicationserviceService){}
jobpost:JobPost=new JobPost();
step=1;
Student: any = null;
jobid=0;
availability?:boolean=true;
screenshotUploaded: boolean = false;



onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.screenshotUploaded = true;
  } else {
    this.screenshotUploaded = false;
  }
}

 // Initialize jobpostStatus with a default value
ngOnInit() {
  const jobId: number = Number(this.route.snapshot.paramMap.get('id')) ?? 0;
  this.jobid = jobId;
  
  this.postlisting.getJobPost(jobId).subscribe({
    next: (value) => {
      this.jobpost = value;

      const closedStatuses = ["CLOSED", "FILLED", "ON_HOLD", "CANCELLED", "EXPIRED"];
      if (closedStatuses.includes(this.jobpost.status)) {
        this.availability = false;
      }

    },
    error: (err) => {
      console.error('Error fetching job post:', err);
      this.error.handleError(err);
    }
  });
}

getstud(){
  this.studentservice.getprofile().subscribe({
    next: (response)=>{
      this.Student=response
      console.log(response.error)
    },
    error: (err) => {
      console.error('Error fetching Student:', err);
      this.error.handleError(err); // Handle the error using ErrorService
    }

  })
}
postapplication(){
  this.applicationService.postApplication(this.jobid).subscribe({
    next: (response)=>{
      console.log(response)
      this.error.setError(response.message,"bg-green-600",10000); // Handle the error using ErrorService
      this.router.navigate(['/notification'])
    },
    error: (err) => {
      console.log(err)

      this.handleLoginError(err) // Handle the error using ErrorService
    }

  })
}
private handleLoginError(error: any) {
  if (error.status === 409) {
    this.error.setError("You Already Had Applied For This Job");
  } else if (error.status === 500) {
    this.error.setError("Invalid credentials.");
  } else if (error.status === 502) {
    this.error.setError("Server error. Please try again later.");
  } else {
    this.error.setError("An unexpected error occurred.");
  }
}
}



