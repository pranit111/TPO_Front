import { Component, OnInit } from '@angular/core';
import { Student } from '../student';
import { StudentService } from '../student.service';
import { ApplicationserviceService } from '../applicationservice.service';
import { PostService } from '../post.service';

interface PaginatedResponse<T> {
  content: T[];
  pageable: any;
  last: boolean;
  totalPages: number;
  totalElements: number;
}

interface Post {
  id: number;
  company: {
    id: number;
    name: string;
    industryType: string;
    email: string;
    contactNumber: string;
    location: string | null;
    website: string | null;
    associatedSince: string | null;
    tpoCoordinator: string | null;
    active: boolean | null;
  };
  jobDesignation: string;
  location: string;
  jobType: string;
  description: string;
  packageAmount: number;
  minPercentage: number;
  backlogAllowance: number;
  preferredCourse: string;
  skillRequirements: string;
  selectionRounds: string;
  modeOfRecruitment: string;
  testPlatform: string;
  applicationStartDate: string;
  applicationEndDate: string;
  selectionStartDate: string;
  selectionEndDate: string;
  aptitudeDate: string | null;
  status: string;
  aptitude: boolean;
  applicationStatus: string | null;
}

// Using the Application interface from the service
type Application = {
  id: number;
  applicationDate: string;
  designation: string;
  feedback: string | null;
  interviewDate: string | null;
  jobPost: {
    id: number;
    company: {
      id: number;
      name: string;
      industry: string;
    };
  };
  status: string;
  student: {
    id: number;
    user: {
      id: number;
      username: string;
      email: string;
    };
    academicYear: string;
    address: string;
    avgMarks: number;
    dateOfBirth: string;
    department: string;
    diplomaMarks: number;
    firstName: string;
    gender: string;
    gr_No: string | null;
    hscMarks: number;
    lastName: string;
    middleName: string;
    noOfBacklogs: number;
    phoneNumber: string;
    profileImageBase64: string | null;
    sem1Marks: number;
    sem2Marks: number;
    sem3Marks: number;
    sem4Marks: number;
  };
};

@Component({
  selector: 'app-tpo-search',
  standalone: false,
  templateUrl: './tpo-search.component.html',
  styleUrl: './tpo-search.component.css'
})
export class TpoSearchComponent implements OnInit {

  // Active tab tracking
  activeTab: 'students' | 'posts' | 'applications' = 'students';

  // Student section properties
  students: Student[] = [];
  departments = ['CSE', 'DS', 'AIML', 'CIVIL', 'ECE'];
  academicYears = ['FE', 'SE', 'TE', 'BE'];
  passingYears = ['2024', '2025', '2026', '2027'];
  avgMarks = [60, 65, 70, 75, 80, 85, 90, 95, 100];
  filters = {
    firstName: '',
    department: '',
    academicYear: '',
    minAvgMarks: undefined as number | undefined,
    maxAvgMarks: undefined as number | undefined,
    yearOfPassing: undefined as number | undefined
  };

  // Post section properties
  posts: Post[] = [];
  companies: { id: number; name: string }[] = [];
  postFilters = {
    status: '',
    company: '',
    position: '',
    jobType: '',
    minSalary: undefined as number | undefined,
    maxSalary: undefined as number | undefined,
    page: 0,
    size: 10
  };

  // Application section properties
  applications: Application[] = [];
  applicationFilters = {
    studentName: '',         // Search by student name
    status: '',             // Filter by application status
    company: '',            // Filter by company name
    department: '',         // Filter by department
    designation: '',           // Filter by job position
    jobtype: '',           // Filter by job type
    minSalary: undefined as number | undefined,  // Filter by minimum salary
    maxSalary: undefined as number | undefined,  // Filter by maximum salary
    fromDate: '',          // Filter by application date range
    toDate: ''            // Filter by application date range
  };

  constructor(
    private studentService: StudentService,
    private applicationservice: ApplicationserviceService,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    this.loadStudents();
    this.loadCompanies();
    this.setActiveTab('students');
  }

  setActiveTab(tab: 'students' | 'posts' | 'applications'): void {
    this.activeTab = tab;
    switch(tab) {
      case 'students':
        this.loadStudents();
        break;
      case 'posts':
        this.loadPosts();
        break;
      case 'applications':
        this.loadApplications();
        break;
    }
  }

  loadStudents(): void {
    this.studentService.getStudents(this.filters).subscribe({
      next: (response: PaginatedResponse<Student>) => {
        this.students = response.content || [];
      },
      error: (error: Error) => {
        console.error('Error fetching students:', error);
        this.students = [];
      }
    });
  }

  loadPosts(): void {
    this.postService.searchPosts(this.postFilters).subscribe({
      next: (response: PaginatedResponse<Post>) => {
        this.posts = response.content || [];
      },
      error: (error: Error) => {
        console.error('Error fetching posts:', error);
        this.posts = [];
      }
    });
  }

  loadApplications(): void {
    this.applicationservice.getapplicationssearch(this.applicationFilters).subscribe({
      next: (response: PaginatedResponse<Application>) => {
        this.applications = response.content || [];
      },
      error: (error: Error) => {
        console.error('Error fetching applications:', error);
        this.applications = [];
      }
    });
  }

  loadCompanies(): void {
    this.postService.getCompanies().subscribe({
      next: (companies) => {
        this.companies = companies.map(company => ({
          id: company.id,
          name: company.name
        }));
      },
      error: (error) => {
        console.error('Error fetching companies:', error);
        this.companies = [];
      }
    });
  }

  downloadExcel(): void {
    if (this.activeTab === 'students') {
      this.studentService.downloadExcel(this.filters).subscribe({
        next: (response: Blob) => {
          this.handleExcelDownload(response, 'students.xlsx');
        },
        error: (error: Error) => {
          console.error('Error downloading Excel:', error);
        }
      });
    } else if (this.activeTab === 'applications') {
      this.applicationservice.downloadExcel(this.applicationFilters).subscribe({
        next: (response: Blob) => {
          this.handleExcelDownload(response, 'applications.xlsx');
        },
        error: (error: Error) => {
          console.error('Error downloading Excel:', error);
        }
      });
    } else if (this.activeTab === 'posts') {
      this.postService.downloadExcel(this.postFilters).subscribe({
        next: (response: Blob) => {
          this.handleExcelDownload(response, 'job_posts.xlsx');
        },
        error: (error: Error) => {
          console.error('Error downloading Excel:', error);
        }
      });
    }
  }

  private handleExcelDownload(response: Blob, filename: string): void {
    const blob = new Blob([response], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  }

  onFilterChange(): void {
    this.loadStudents();
  }
  selectedApplication= {
    id:0,
    status:"",
    feedback:"",
    interviewDate:"",

  };
  showEditApplicationModal=false;
  onApplicationedit(id:number) {
    this.selectedApplication.id=id;
    this.showEditApplicationModal=true;
    }
    onUpdateApplication() {
    this.applicationservice.updateApplication({
      ...this.selectedApplication,
      interviewDate: this.selectedApplication.interviewDate
    }).subscribe({
      next: (response) => {
        console.log('Application updated successfully:', response);
        this.loadApplications();
        this.selectedApplication={
          id:0,
          status:"",
          feedback:"",
          interviewDate:"",
        };
      },
      error: (error) => {
        console.error('Error updating application:', error);
      }
    });
    this.showEditApplicationModal=false;
    }
  onApplicationEditCancel() {
    this.showEditApplicationModal=false;
    }
    onPostEdit() {
    throw new Error('Method not implemented.');
    }
}
