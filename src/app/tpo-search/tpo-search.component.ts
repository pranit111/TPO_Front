import { Component, OnInit } from '@angular/core';
import { Student } from '../student';
import { StudentService } from '../student.service';
import { ApplicationserviceService } from '../applicationservice.service';
import { PostService } from '../post.service';
import { Router } from '@angular/router';

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
  interviewTime: string | null;
  interviewLocation: string | null;
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
onResume(arg0: number) {

window.open(`/download/cv/${arg0}/ignore`, '_blank');
}
onResult(type: string, arg0: number) {  
  window.open(`/download/result/${arg0}/${type}`, '_blank');
}
selectedstudent: Student = new Student(); 
showStudentActionModal = false;
OnStudentAction(id:number){
  this.showStudentActionModal = true;
  this.selectedstudent = this.students.find((student) => student.id === id) || new Student();

}

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
    toDate: ''  
              // Filter by application date range
  };

  constructor(
    private studentService: StudentService,
    private applicationservice: ApplicationserviceService,
    private postService: PostService,
    private router: Router
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
  formatTime(timeString: string): string {
    if (!timeString) return '';
    
 
    
   
    const [hours, minutes] = timeString.slice(0, 5).split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  
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
    interviewTime:"",
    interviewLocation:"",

  };
  showEditApplicationModal=false;
  onApplicationedit(id: number) {
    this.selectedApplication.id = id;
    this.showEditApplicationModal
    // You need to fetch the application details here
    this.applicationservice.getApplicationById(id).subscribe({
      next: (application) => {
        this.selectedApplication = {
          id: application.id,
          status: application.status || "",
          feedback: application.feedback || "",
          interviewDate: application.interviewDate || "",
          interviewTime: application.interviewTime || "",
          interviewLocation: application.interviewLocation || "",
        };
        this.showEditApplicationModal = true;
      },
      error: (error) => {
        console.error('Error fetching application:', error);
      }
    });
  }
    onUpdateApplication() {
    this.applicationservice.updateApplication({
      ...this.selectedApplication,
      interviewDate: this.selectedApplication.interviewDate,
      interviewLocation: this.selectedApplication.interviewLocation,
      interviewTime: this.selectedApplication.interviewTime,
    }).subscribe({
      next: (response) => {
        console.log('Application updated successfully:', response);
        this.loadApplications();
        this.selectedApplication={
          id:0,
          status:"",
          feedback:"",
          interviewDate:"",
          interviewTime:"",
          interviewLocation:"",
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
 
    // Variables
    selectedPost = {
      id: 0,
      title: '',                   // Job Designation
      description: '',
      location: '',
      jobType: 'FULL_TIME',        // Default to FULL_TIME
      status: 'OPEN',
    
      packageAmount: null,         // Package Amount
      minimumSsc: null,            // Minimum SSC %
      minimumHsc: null,            // Minimum HSC %
      minPercentage: null,         // Minimum Average %
    
      backlogAllowance: null,      // Backlog Allowed
      preferredCourse: '',         // Preferred Course
      skillRequirements: '',       // Skills Required
      selectionRounds: '',         // Rounds of Selection
      modeOfRecruitment: '',       // Recruitment Mode
      testPlatform: '',            // Test Platform
    
      applicationStartDate: '',    // Dates as string (or convert to Date if needed)
      applicationEndDate: '',
      selectionStartDate: '',
      selectionEndDate: '',
      aptitudeDate: '',
    
      aptitude: false,             // Aptitude Test Yes/No
      portalLink: ''
    };
    
showEditPostModal = false;

// Open edit modal and load selected post
onPostEdit(id: number) {
  this.postService.getPostById(id).subscribe({
    next: (data) => {
   
      this.selectedPost = { ...data };
      this.showEditPostModal = true;
      console.log(this.showEditPostModal);
    },
    error: (error) => {
      console.error('Error fetching post data:', error);
    }
  });
}

// Update the post
onUpdatePost() {
  this.postService.updatePost(this.selectedPost).subscribe({
    next: (response) => {
      console.log('Post updated successfully:', response);
      this.loadPosts(); // Refresh the post list
      this.resetSelectedPost();
      this.loadPosts();
    },
    error: (error) => {
      console.error('Error updating post:', error);
    }
  });
  this.showEditPostModal = false;
}

// Cancel post editing
onPostEditCancel() {
  this.showEditPostModal = false;
  this.resetSelectedPost();
}

// Reset post data
resetSelectedPost() {
 this.selectedPost = {
  id: 0,
  title: '',                   // Job Designation
  description: '',
  location: '',
  jobType: 'FULL_TIME',        // Default to FULL_TIME
  status: 'OPEN',

  packageAmount: null,         // Package Amount
  minimumSsc: null,            // Minimum SSC %
  minimumHsc: null,            // Minimum HSC %
  minPercentage: null,         // Minimum Average %

  backlogAllowance: null,      // Backlog Allowed
  preferredCourse: '',         // Preferred Course
  skillRequirements: '',       // Skills Required
  selectionRounds: '',         // Rounds of Selection
  modeOfRecruitment: '',       // Recruitment Mode
  testPlatform: '',            // Test Platform

  applicationStartDate: '',    // Dates as string (or convert to Date if needed)
  applicationEndDate: '',
  selectionStartDate: '',
  selectionEndDate: '',
  aptitudeDate: '',

  aptitude: false,             // Aptitude Test Yes/No
  portalLink: ''
};
;
}

}
