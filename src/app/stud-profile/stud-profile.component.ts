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

 // In your component.ts file
ngOnInit() {
  this.service.getprofile().subscribe({
    next: (response: any) => {
      console.log("Full Response from API:", response);
      this.profileData = response;
      
      localStorage.setItem("username", response.firstName + " " + response.lastName);
      
      // Check if the image exists and is not null or empty
      if (response.profileImageBase64 && response.profileImageBase64.trim() !== '') {
        // Make sure the base64 string doesn't already include the data URI prefix
        if (response.profileImageBase64.startsWith('data:')) {
          this.profileImageUrl = response.profileImageBase64;
        } else {
          this.profileImageUrl = `data:image/png;base64,${response.profileImageBase64}`;
        }
        console.log("Image URL set to:", this.profileImageUrl.substring(0, 30) + "...");
      } else {
        // Make sure the default image path is correct relative to your application
        this.profileImageUrl = 'assets/images/default_prof_img.png';
        console.log("Using default image:", this.profileImageUrl);
      }
    },
    error: (err) => {
      console.error("Error fetching profile:", err);
      // Fallback to default image on error
      this.profileImageUrl = 'assets/images/default_prof_img.png';
    }
  });
}
}
