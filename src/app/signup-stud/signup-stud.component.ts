
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormsModule } from '@angular/forms';
import { StudentService } from '../student.service';
import { Student, Gender } from '../student';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-signup-stud',
  standalone: false,
  templateUrl: './signup-stud.component.html',
  styleUrl: './signup-stud.component.css',
 
})
export class SignupStudComponent {
  step=1
  nextStep() {
    if (this.step < 3) this.step++;
  }

  prevStep() {
    if (this.step > 1) this.step--;
  }
onSubmit() {
throw new Error('Method not implemented.');
}studentForm: FormGroup; // Form group for reactive form
student: Student = new Student(); // Object for storing form data
genders = Object.values(Gender); // Convert Gender enum to an array for radio buttons

constructor(private fb: FormBuilder, private studentService: StudentService) {
  this.studentForm = this.fb.group({
    firstName: [this.student.firstName, Validators.required],
    middleName: [this.student.middleName],
    lastName: [this.student.lastName, Validators.required],
    dateOfBirth: [this.student.dateOfBirth, Validators.required],
    gender: [this.student.gender, Validators.required], // Gender enum field
    phoneNumber: [this.student.phoneNumber, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    address: [this.student.address, Validators.required],
    department: [this.student.department, Validators.required],
    sscMarks: [this.student.sscMarks, Validators.required],
    hscMarks: [this.student.hscMarks],
    diplomaMarks: [this.student.diplomaMarks],
    sem1Marks: [this.student.sem1Marks],
    sem2Marks: [this.student.sem2Marks],
    sem3Marks: [this.student.sem3Marks],
    sem4Marks: [this.student.sem4Marks],
    sem5Marks: [this.student.sem5Marks],
    sem6Marks: [this.student.sem6Marks],
    noOfBacklogs: [this.student.noOfBacklogs, Validators.required]
  });
}

submitStudent(): void {  

  this.studentService.createStudent(this.student).subscribe({
    next: () => {
      alert('Student created successfully!');
      this.studentForm.reset(); // Reset the form
      this.student = new Student(); // Reset the object
    },
    error: (err) => {
      console.error('Error creating student', err);
      alert('Failed to create student');
    }
   });
  // if (this.studentForm.valid) {
  //   console.log("valid")
  //   this.student = this.studentForm.value; // Assign form values to Student object

  //   this.studentService.createStudent(this.student).subscribe({
  //     next: () => {
  //       alert('Student created successfully!');
  //       this.studentForm.reset(); // Reset the form
  //       this.student = new Student(); // Reset the object
  //     },
  //     error: (err) => {
  //       console.error('Error creating student', err);
  //       alert('Failed to create student');
  //     }
  //   });
  }
}
