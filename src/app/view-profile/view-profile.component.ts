import { Component } from '@angular/core';
import { ErrorService } from '../error.service';
import { TpoAdminService } from '../tpo-admin.service';
import { StudentService } from '../student.service';
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
  constructor( private error: ErrorService,private adminservice:TpoAdminService, private studentService: StudentService, private route: ActivatedRoute) {}
  profileData: any = null;
  profileImageUrl: string = 'default_prof_img.png'; // Default image
  id: number = 0;
  
  // Verification modal properties
  showVerificationModal: boolean = false;
  verificationRemarks: string = '';
  isVerifying: boolean = false;

ngOnInit() {
  this.id = Number(this.route.snapshot.paramMap.get('id')) ?? 0;
  this.adminservice.getStudentProfile(this.id).subscribe({
    next: (response: any) => {
      console.log("Full Response from API:", response);
      this.profileData = response;
      
      localStorage.setItem("username", response.firstName + " " + response.lastName);
      
      // Check if the image exists and is not null or empty
      if (response.profileImageBase64 && response.profileImageBase64.trim() !== '') {
        try {
          let base64String = response.profileImageBase64;
          
          // Fix corrupted UTF-8 encoded base64 (backend issue workaround)
          if (base64String.includes('77+9') || base64String.includes('e+/v')) {
            console.warn('Detected corrupted base64 data - attempting to fix...');
            // Try to decode the UTF-8 corrupted string
            const bytes = new Uint8Array(
              atob(base64String).split('').map(c => c.charCodeAt(0))
            );
            base64String = btoa(String.fromCharCode(...bytes));
          }
          
          // Make sure the base64 string doesn't already include the data URI prefix
          if (base64String.startsWith('data:')) {
            this.profileImageUrl = base64String;
          } else {
            this.profileImageUrl = `data:image/jpeg;base64,${base64String}`;
          }
          console.log("Image URL set successfully");
        } catch (error) {
          console.error("Error processing image:", error);
          this.profileImageUrl = 'assets/images/default_prof_img.png';
        }
      } else {
        // Make sure the default image path is correct relative to your application
        this.profileImageUrl = 'assets/images/default_prof_img.png';
        console.log("Using default image:", this.profileImageUrl);
      }
      
      // Fetch verification status
      this.fetchVerificationStatus();
    },
    error: (err) => {
      console.error("Error fetching profile:", err);
      // Fallback to default image on error
      this.profileImageUrl = 'assets/images/default_prof_img.png';
    }
  });
}

fetchVerificationStatus() {
  this.studentService.getStudentVerificationStatus(this.id).subscribe({
    next: (verificationData) => {
      console.log("Verification status:", verificationData);
      // Update profile data with verification information
      this.profileData.resultsVerified = verificationData.verified;
      this.profileData.verificationRemarks = verificationData.remarks;
      this.profileData.verifiedBy = verificationData.verifiedBy;
      this.profileData.verificationDate = verificationData.verificationDate;
    },
    error: (error) => {
      console.error('Error fetching verification status:', error);
      // Set default values if verification status cannot be fetched
      this.profileData.resultsVerified = false;
      this.profileData.verificationRemarks = null;
      this.profileData.verifiedBy = null;
      this.profileData.verificationDate = null;
    }
  });
}

openVerificationModal() {
  this.showVerificationModal = true;
  this.verificationRemarks = '';
}

closeVerificationModal() {
  this.showVerificationModal = false;
  this.verificationRemarks = '';
  this.isVerifying = false;
}

verifyStudent() {
  if (this.isVerifying) return;
  
  this.isVerifying = true;
  
  this.studentService.verifyStudentResults(this.id, true, this.verificationRemarks).subscribe({
    next: (response) => {
      console.log('Verification successful:', response);
      
      // Update the profile data immediately
      this.profileData.resultsVerified = true;
      this.profileData.verificationRemarks = this.verificationRemarks;
      this.profileData.verifiedBy = 'Current Admin'; // You might want to get this from user session
      this.profileData.verificationDate = new Date().toISOString();
      
      // Close modal and reset state
      this.closeVerificationModal();
      
      // Show success message
      this.error.setError('Student results verified successfully!', 'bg-green-600');
    },
    error: (error) => {
      console.error('Error verifying student:', error);
      this.isVerifying = false;
      this.error.setError('Failed to verify student results. Please try again.', 'bg-red-600');
    }
  });
}

revokeVerification() {
  if (confirm('Are you sure you want to revoke the verification for this student? This action cannot be undone.')) {
    this.studentService.verifyStudentResults(this.id, false, 'Verification revoked by admin').subscribe({
      next: (response) => {
        console.log('Verification revoked successfully:', response);
        
        // Update the profile data immediately
        this.profileData.resultsVerified = false;
        this.profileData.verificationRemarks = 'Verification revoked by admin';
        this.profileData.verifiedBy = null;
        this.profileData.verificationDate = null;
        
        // Show success message
        this.error.setError('Student verification revoked successfully!', 'bg-yellow-600');
      },
      error: (error) => {
        console.error('Error revoking verification:', error);
        this.error.setError('Failed to revoke verification. Please try again.', 'bg-red-600');
      }
    });
  }
}

}