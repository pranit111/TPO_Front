import { Component } from '@angular/core';
import { Student } from '../student';
import { StudentService } from '../student.service';
import { ErrorService } from '../error.service';
@Component({
  selector: 'app-stud-profile',
  standalone: false,
  templateUrl: './stud-profile.component.html',
  styleUrl: './stud-profile.component.css'
})
export class StudProfileComponent {
  profileData: any = null; // Store the API response here
  profileImageUrl: string = 'default_prof_img.png'; // Default image


  

  get progressStyle(): string {
    return `conic-gradient(#0D5C68 ${this.profileData.avgMarks}%, #A2191F 0%)`;
  }
  constructor(private service: StudentService, private error: ErrorService) {}

  ngOnInit() {
    this.service.getprofile().subscribe({
      next: (response: any) => {
        console.log("Full Response from API:", response);
        this.profileData = response; // Assign the API response to profileData
        
          localStorage.setItem("username",response.firstName+" " +response.lastName)
        // Convert Base64 image if available
        if (response.profileImageBase64) {
          this.profileImageUrl = `data:image/png;base64,${response.profileImageBase64}`;
        }
      },
      error: (err) => {
        console.error("Error fetching profile:", err);
      }
    });
  }
}
