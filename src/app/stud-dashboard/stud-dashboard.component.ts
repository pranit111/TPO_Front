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
  color=''
  getStatusColor(status: string): string {
    switch (status) {
      case 'APPLIED': return 'bg-blue-400';         
      case 'UNDER_REVIEW': return 'bg-yellow-400'; 
      case 'SHORTLISTED': return 'bg-orange-400';   
      case 'REJECTED': return 'bg-red-400';         
      case 'OFFERED': return 'bg-green-400';      
      case 'HIRED': return 'bg-green-600';        
      default: return 'bg-gray-500';               
    }
  }
ngOnInit(){
  this.applicationservice.getapplications().subscribe({
    next: (response) => {
          this.applications = response.results; // Access the results array from PaginatedResponse
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
