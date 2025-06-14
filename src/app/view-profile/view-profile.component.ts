import { Component } from '@angular/core';
import { ErrorService } from '../error.service';
import { TpoAdminService } from '../tpo-admin.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-profile',
  standalone: false,
  templateUrl: './view-profile.component.html',
  styleUrl: './view-profile.component.css'
})
export class ViewProfileComponent {
onBack(){
  window.history.back();  

} 
  constructor( private error: ErrorService,private adminservice:TpoAdminService,private route: ActivatedRoute) {}
  profileData: any = null;
  profileImageUrl: string = 'default_prof_img.png'; // Default image
  id: number = 0;

ngOnInit() {
  this.id = Number(this.route.snapshot.paramMap.get('id')) ?? 0;
  this.adminservice.getStudentProfile(this.id).subscribe({
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