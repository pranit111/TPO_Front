import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { StudentService } from '../student.service';
import { Student, Gender } from '../student';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CropperService } from '../cropper.service';
import { Router } from '@angular/router';
import { ErrorService } from '../error.service';

@Component({
  
  selector: 'app-signup-stud',
  standalone: false,
  templateUrl: './signup-stud.component.html',
  styleUrl: './signup-stud.component.css',
})
export class SignupStudComponent {
  readonly MAX_FILE_SIZE_MB = 1;
readonly MAX_FILE_SIZE_BYTES = this.MAX_FILE_SIZE_MB * 1024 * 1024;
readonly PDF_MIME_TYPE = 'application/pdf';

  step = 1;
  studentForm: FormGroup;
  student: Student = new Student();
  departments: string[] = ['CSE', 'DS', 'AIML', 'CIVIL', 'ECE'];
  academicYears: string[] = ['FE', 'SE', 'TE', 'BE'];
  genders = Object.values(Gender); // Gender options for radio buttons
  resume: File | null = null; // Store the uploaded file
  profile_pic: File | null = null;
  isDiplomaStudent: boolean = false; // New flag for diploma student
  
  // Document uploads
  sscResult: File | null = null;
  hscResult: File | null = null;
  diplomaResult: File | null = null;
  
  // Cropper properties
  @ViewChild('imageCropper') imageElement!: ElementRef;
  imageUrl: string | null = null;
  croppedImage!: Blob;
  showCropModal: boolean = false;
isHscStudent: boolean = false; // New flag for HSC student

  constructor(
    private fb: FormBuilder, 
    private studentService: StudentService,
    private cropperService: CropperService,
    private router: Router,
    private error: ErrorService
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
      // Add KT checkboxes
      sem1KT: [false],
      sem2KT: [false],
      sem3KT: [false],
      sem4KT: [false],
      sem5KT: [false],
      sem6KT: [false],
      isDiplomaStudent: [false],
      isHscStudent: [false],
      noOfBacklogs: ['']
    });
  }

  // Calculate total KT count dynamically
  calculateTotalKT(): number {
    let count = 0;
    // Skip sem1 and sem2 for diploma students
    if (!this.isDiplomaStudent) {
      if (this.student.sem1KT) count++;
      if (this.student.sem2KT) count++;
    }
    if (this.student.sem3KT) count++;
    if (this.student.sem4KT) count++;
    if (this.student.sem5KT) count++;
    if (this.student.sem6KT) count++;
    return count;
  }

  nextStep() {
    // Validate first step
    if (this.step === 1) {
      // For diploma students, set semesters 1 and 2 to null
      if (this.isDiplomaStudent) {
        this.student.sem1Marks = null;
        this.student.sem2Marks = null;
        this.student.sem1KT = false;
        this.student.sem2KT = false;
        this.student.hscMarks = null;
      } else {
        this.student.diplomaMarks = null;
      }
    }
    
    if (this.step < 3) this.step++;
  }

  prevStep() {
    if (this.step > 1) this.step--;
  }

  // Capture file input
  onFileSelectedresume(event: any): void {
    const file = event.target.files[0];
    if (file && this.validatePDFFile(file, 'Resume')) {
      this.resume = file;
    } else {
      this.resume = null;
      event.target.value = ''; // Clear input
    }
  }
  

  // Handle file selection for profile picture
  onFileSelectedprof(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > this.MAX_FILE_SIZE_BYTES * 2) { // 2MB limit for images?
        alert('Profile picture must not exceed 2MB.');
        event.target.value = '';
        return;
      }
  
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
  

  // New methods for handling result document uploads
  onFileSelectedSSCResult(event: any): void {
    const file = event.target.files[0];
    if (file && this.validatePDFFile(file, 'SSC Result')) {
      this.sscResult = file;
    } else {
      this.sscResult = null;
      event.target.value = '';
    }
  }
  
  onFileSelectedHSCResult(event: any): void {
    const file = event.target.files[0];
    if (file && this.validatePDFFile(file, 'HSC Result')) {
      this.hscResult = file;
    } else {
      this.hscResult = null;
      event.target.value = '';
    }
  }
  

  onFileSelectedDiplomaResult(event: any): void {
    const file = event.target.files[0];
    if (file && this.validatePDFFile(file, 'Diploma Result')) {
      this.diplomaResult = file;
    } else {
      this.diplomaResult = null;
      event.target.value = '';
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
    console.log(this.student.gender);
    
    // Only use the calculated KT count if nothing was manually entered
    if (this.student.noOfBacklogs === null || this.student.noOfBacklogs === undefined) {
      this.student.noOfBacklogs = this.calculateTotalKT();
    }
    
    const formData = new FormData();
    formData.append('student', new Blob([JSON.stringify(this.student)], { type: 'application/json' }));

    // Append files if available
    if (this.resume) {
      formData.append('resume', this.resume);
    }
    if (this.profile_pic) {
      formData.append('prof_img', this.profile_pic);
    }
    
    // Add the result documents
    if (this.sscResult) {
      formData.append('ssc_result', this.sscResult);
    }
    if (this.hscResult) {
      formData.append('hsc_result', this.hscResult);
    }
    if (this.diplomaResult) {
      formData.append('diploma_result', this.diplomaResult);
    }

    // Call service to send data
    this.studentService.createStudent(formData).subscribe({
      next: () => {
        alert('Student created successfully!');
        this.router.navigate(['/profile']);
        this.studentForm.reset(); // Reset form
        this.student = new Student(); // Reset object
        // Reset all file inputs
        this.resume = null;
        this.profile_pic = null;
        this.sscResult = null;
        this.hscResult = null;
        this.diplomaResult = null;
        this.isDiplomaStudent = false;
      },
      error: (err) => {
        console.error('Error creating student', err);
        alert('Failed to create student');
      }
    });
  }
  validatePDFFile(file: File, fieldName: string): boolean {
    if (file.type !== this.PDF_MIME_TYPE) {
      this.error.setError(`${fieldName} must be a PDF file.`);
      return false;
    }
  
    if (file.size > this.MAX_FILE_SIZE_BYTES) {
      this.error.setError(`${fieldName} must not exceed ${this.MAX_FILE_SIZE_MB} MB.`);
      return false;
    }
  
    return true;
  }
  
}
