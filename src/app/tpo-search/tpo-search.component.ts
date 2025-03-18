import { Component, OnInit } from '@angular/core';
import { Student } from '../student';
import { StudentService } from '../student.service';

interface PaginatedResponse<T> {
  content: T[];
  pageable: any;
  last: boolean;
  totalPages: number;
  totalElements: number;
}

@Component({
  selector: 'app-tpo-search',
  standalone: false,
  templateUrl: './tpo-search.component.html',
  styleUrl: './tpo-search.component.css'
})
export class TpoSearchComponent implements OnInit {

  // In tpo-search.component.ts
departments: string[] = ['CSE', 'DS', 'AIML', 'CIVIL', 'ECE'];
academicYears: string[] = ['FE', 'SE', 'TE', 'BE'];
passingYears: string[] = ['2024', '2025', '2026', '2027'];
avgMarks: number[] = [60, 65, 70, 75, 80, 85, 90, 95, 100];
  students: Student[] = [];
  filters = {
    firstName: '',
    department: '',
    academicYear: '',
    minAvgMarks: undefined as number | undefined,
    maxAvgMarks: undefined as number | undefined,
    yearOfPassing: undefined as number | undefined
  };

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.loadStudents();
  }
  downloadExcel(): void {
    this.studentService.downloadExcel(this.filters).subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], { 
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });
        
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'students.xlsx';
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      },
      error: (error) => {
        console.error('Error downloading Excel:', error);
      }
    });
  }
  loadStudents(): void {
    this.studentService.getStudents(this.filters).subscribe({
      next: (response: PaginatedResponse<Student>) => {
        this.students = response.content || [];
      },
      error: (error) => {
        console.error('Error fetching students:', error);
        this.students = [];
      }
    });
  }
  

  onFilterChange(): void {
    this.loadStudents();
  }
}
