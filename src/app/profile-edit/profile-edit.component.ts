import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Student } from '../student';
import { StudentService } from '../student.service';
import { CropperService } from '../cropper.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-edit',
  standalone: false,
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.css'
})
export class ProfileEditComponent implements OnInit {
  showPopup = false;
  changesList: { key: string; oldValue: any; newValue: any }[] = [];
  student = new Student();
  Current_profile: any = null;
  profileImageUrl: string = 'default_prof_img.png';
  step = 1;
  resume: File | null = null;
  profile_pic: File | null = null;

  // Cropper properties
  @ViewChild('imageCropper') imageElement!: ElementRef;
  imageUrl: string | null = null;
  croppedImage: Blob | null = null;
  showCropModal = false;

  constructor(
    private service: StudentService,
    private cropperService: CropperService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.service.getprofile().subscribe({
      next: (response: any) => {
        console.log("Full Response from API:", response);
        this.Current_profile = response;
        
        localStorage.setItem("username", response.firstName + " " + response.lastName);

        if (response.profileImageBase64) {
          this.profileImageUrl = `data:image/png;base64,${response.profileImageBase64}`;
        }
      },
      error: (err) => {
        console.error("Error fetching profile:", err);
      }
    });
  }

  showConfirmation(): void {
    if (!this.Current_profile) {
      alert("Profile data not loaded yet. Please try again.");
      return;
    }

    this.changesList = [];

    Object.keys(this.student)
      .filter(key => !['id', 'avgMarks', 'gender', 'updatedAt'].includes(key))
      .forEach((key) => {
        if (this.student[key as keyof Student] !== this.Current_profile[key]) {
          this.changesList.push({
            key: key.charAt(0).toUpperCase() + key.slice(1),
            oldValue: this.Current_profile[key],
            newValue: this.student[key as keyof Student]
          });
        }
      });

    if (this.changesList.length > 0) {
      this.showPopup = true;
    } else {
      alert("No changes detected.");
    }
  }

  hideConfirmation(): void {
    this.showPopup = false;
  }

  confirmChanges(): void {
    this.service.updateStudent(this.Current_profile.id, this.student).subscribe({
      next: (response: any) => {
        console.log('Updated Student:', response);
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        console.error('Error updating student:', err);
      }
    });
  }

  nextStep(): void {
    if (this.step < 3) {
      this.step++;
    }
  }

  prevStep(): void {
    if (this.step > 1) {
      this.step--;
    }
  }

  onFileSelectedresume(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.resume = input.files[0];
    }
  }

  onFileSelectedprof(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.profile_pic = input.files[0];
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onload = () => {
        this.imageUrl = reader.result as string;
        this.showCropModal = true;
        
        setTimeout(() => {
          if (this.imageElement?.nativeElement) {
            this.cropperService.initializeCropper(this.imageElement.nativeElement);
          }
        }, 100);
      };
      
      reader.readAsDataURL(file);
    }
  }

  async cropImage(): Promise<void> {
    try {
      this.croppedImage = await this.cropperService.cropImage();
      if (this.croppedImage) {
        this.imageUrl = URL.createObjectURL(this.croppedImage);
      }
      this.showCropModal = false;
      this.cropperService.destroyCropper();
    } catch (error) {
      console.error('Crop error:', error);
    }
  }

  cancelCrop(): void {
    this.showCropModal = false;
    this.imageUrl = null;
    this.cropperService.destroyCropper();
  }
}
