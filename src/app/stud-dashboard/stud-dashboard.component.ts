import { Component } from '@angular/core';
import { ApplicationserviceService } from '../applicationservice.service';
import { ErrorService } from '../error.service';

@Component({
  selector: 'app-stud-dashboard',
  standalone: false,
  templateUrl: './stud-dashboard.component.html',
  styleUrl: './stud-dashboard.component.css'
})
export class StudDashboardComponent {
  constructor(private applicationservice:ApplicationserviceService,private error:ErrorService){}
  applications:any[]=[];
ngOnInit(){
  this.applicationservice.getapplications().subscribe({
    next: (response) => {
          this.applications = response; // Store fetched job posts
          console.log(this.applications); // Log to check if data is received correctly
        },
        error: (err) => {
          console.error('Error fetching job posts:', err);
        }
      });
      


}
showModal = false;
selectedApplication: any = null;
  openModal(application: any) {
    this.selectedApplication = application;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedApplication = null;
  }
}
