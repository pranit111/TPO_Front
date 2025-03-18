import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormsModule } from '@angular/forms';
import { StudentService } from '../student.service';
import { Student, Gender } from '../student';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CropperService } from '../cropper.service';

@Component({
  selector: 'app-signup-stud',
  standalone: false,
  templateUrl: './signup-stud.component.html',
  styleUrl: './signup-stud.component.css',
 
})
export class SignupStudComponent {
  step = 1;
  studentForm: FormGroup;
  student: Student = new Student();
  
  genders = Object.values(Gender); // Gender options for radio buttons
  resume: File | null = null; // Store the uploaded file
  profile_pic: File | null = null;
  
  // Cropper properties
  @ViewChild('imageCropper') imageElement!: ElementRef;
  imageUrl: string | null = null;
  croppedImage!: Blob;
  showCropModal: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private studentService: StudentService,
    private cropperService: CropperService
  ) {
    this.studentForm = this.fb.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: [null, Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', Validators.required],
      department: ['', Validators.required],
      sscMarks: ['', Validators.required],
      hscMarks: [''],
      diplomaMarks: [''],
      sem1Marks: [''],
      sem2Marks: [''],
      sem3Marks: [''],
      sem4Marks: [''],
      sem5Marks: [''],
      sem6Marks: [''],
      noOfBacklogs: ['', Validators.required]
    });
  }

  nextStep() {
    if (this.step < 3) this.step++;
  }

  prevStep() {
    if (this.step > 1) this.step--;
  }

  // Capture file input
  onFileSelectedresume(event: any): void {
    if (event.target.files.length > 0) {
      this.resume = event.target.files[0];
    }
  }

  // Handle file selection for profile picture
  onFileSelectedprof(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result as string;
        this.showCropModal = true;
        setTimeout(() => {
          this.cropperService.initializeCropper(this.imageElement.nativeElement);
        }, 100);
      };
      reader.readAsDataURL(file);
    }
  }

  // Crop the image using service
  async cropImage() {
    try {
      this.croppedImage = await this.cropperService.cropImage();
      this.profile_pic = new File([this.croppedImage], 'profile_pic.jpg', { type: 'image/jpeg' });
      this.imageUrl = URL.createObjectURL(this.croppedImage);
      this.showCropModal = false;
      this.cropperService.destroyCropper();
    } catch (error) {
      console.error('Crop error:', error);
    }
  }

  // Cancel cropping
  cancelCrop() {
    this.showCropModal = false;
    this.imageUrl = null;
    this.cropperService.destroyCropper();
  }

  // Submit Student Data
  submitStudent(): void {
    console.log(this.student.gender)
    const formData = new FormData();
    formData.append('student', new Blob([JSON.stringify(this.student)], { type: 'application/json' }));
    // Append JSON data
    // Object.keys(this.studentForm.controls).forEach((key) => {
    //   const value = this.studentForm.get(key)?.value;
    //   if (value !== null && value !== undefined) {
    //     formData.append(key, value);
    //   }
    // });

    // Append file if available
    if (this.resume) {
      formData.append('resume', this.resume);
    }
    if(this.profile_pic){
      formData.append('prof_img',this.profile_pic)
    }

    // Call service to send data
    this.studentService.createStudent(formData).subscribe({
      next: () => {
        alert('Student created successfully!');
        this.studentForm.reset(); // Reset form
        this.student = new Student(); // Reset object
        this.resume = null; // Clear file input
      },
      error: (err) => {
        console.error('Error creating student', err);
        alert('Failed to create student');
      }
    });
  }
}